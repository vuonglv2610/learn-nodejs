const UserModel = require('../models/user.model');
const CustomerModel = require('../models/customer.model');
const RoleModel = require('../models/role.model');
const Response = require('../helpers/response');
const bcrypt = require('bcrypt');

module.exports = {
  getProfile: async (req, res) => {
    try {
      const token = req.header('Authorization')?.split(' ')[1];
      
      if (!token) {
        return Response.fail(req, res, 401, 'Unauthorized');
      }
      
      const jwt = require('jsonwebtoken');
      let decoded;
      
      try {
        decoded = jwt.verify(token, process.env.KEY_JWT);
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          return Response.fail(req, res, 401, 'Token đã hết hạn, vui lòng đăng nhập lại');
        } else if (error.name === 'JsonWebTokenError') {
          return Response.fail(req, res, 401, 'Token không hợp lệ');
        } else {
          throw error;
        }
      }
      
      let profile;
      let accountType;
      
      // Kiểm tra loại tài khoản từ token
      if (decoded.customerId) {
        // Tìm customer profile (không có role)
        profile = await CustomerModel.findOne({
          where: { id: decoded.customerId, deletedAt: null },
          attributes: { exclude: ['password', 'confirmPassword'] }
        });
        accountType = 'customer';
      } else if (decoded.userId) {
        // Tìm user profile với role information
        profile = await UserModel.findOne({
          where: { id: decoded.userId, deletedAt: null },
          attributes: { exclude: ['password', 'confirmPassword'] },
          include: [
            {
              model: RoleModel,
              as: 'role',
              attributes: ['id', 'role', 'role_key']
            }
          ]
        });
        accountType = 'user';
      } else {
        return Response.fail(req, res, 400, 'Invalid token');
      }
      
      if (!profile) {
        return Response.fail(req, res, 404, 'Profile not found');
      }
      
      // Thêm thông tin loại tài khoản vào response
      const responseData = {
        ...profile.toJSON(),
        accountType
      };
      
      return Response.success(req, res, responseData);
    } catch (error) {
      console.error('Get profile error:', error);
      return Response.fail(req, res, 500, 'Server error');
    }
  },
  
  updateProfile: async (req, res) => {
    try {
      const token = req.header('Authorization')?.split(' ')[1];
      
      if (!token) {
        return Response.fail(req, res, 401, 'Unauthorized');
      }
      
      const jwt = require('jsonwebtoken');
      let decoded;
      
      try {
        decoded = jwt.verify(token, process.env.KEY_JWT);
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          return Response.fail(req, res, 401, 'Token đã hết hạn, vui lòng đăng nhập lại');
        } else if (error.name === 'JsonWebTokenError') {
          return Response.fail(req, res, 401, 'Token không hợp lệ');
        } else {
          throw error;
        }
      }
      
      let profile;
      let Model;
      let id;
      
      // Kiểm tra loại tài khoản từ token
      if (decoded.customerId) {
        Model = CustomerModel;
        id = decoded.customerId;
      } else if (decoded.userId) {
        Model = UserModel;
        id = decoded.userId;
      } else {
        return Response.fail(req, res, 400, 'Invalid token');
      }
      
      // Lấy dữ liệu cần cập nhật từ request body
      const updateData = { ...req.body };
      
      // Loại bỏ các trường nhạy cảm
      delete updateData.password;
      delete updateData.confirmPassword;
      delete updateData.id;
      delete updateData.roleId;
      delete updateData.google_id;
      
      // Cập nhật profile
      await Model.update(updateData, {
        where: { id, deletedAt: null }
      });
      
      // Lấy profile đã cập nhật
      if (decoded.userId) {
        // User profile với role information
        profile = await Model.findOne({
          where: { id, deletedAt: null },
          attributes: { exclude: ['password', 'confirmPassword'] },
          include: [
            {
              model: RoleModel,
              as: 'role',
              attributes: ['id', 'role', 'role_key']
            }
          ]
        });
      } else {
        // Customer profile (không có role)
        profile = await Model.findOne({
          where: { id, deletedAt: null },
          attributes: { exclude: ['password', 'confirmPassword'] }
        });
      }
      
      if (!profile) {
        return Response.fail(req, res, 404, 'Profile not found');
      }
      
      return Response.success(req, res, profile);
    } catch (error) {
      console.error('Update profile error:', error);
      return Response.fail(req, res, 500, 'Server error');
    }
  },
  
  changePassword: async (req, res) => {
    try {
      const token = req.header('Authorization')?.split(' ')[1];
      
      if (!token) {
        return Response.fail(req, res, 401, 'Unauthorized');
      }
      
      const jwt = require('jsonwebtoken');
      let decoded;
      
      try {
        decoded = jwt.verify(token, process.env.KEY_JWT);
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          return Response.fail(req, res, 401, 'Token đã hết hạn, vui lòng đăng nhập lại');
        } else if (error.name === 'JsonWebTokenError') {
          return Response.fail(req, res, 401, 'Token không hợp lệ');
        } else {
          throw error;
        }
      }
      
      let Model;
      let id;
      
      // Kiểm tra loại tài khoản từ token
      if (decoded.customerId) {
        Model = CustomerModel;
        id = decoded.customerId;
      } else if (decoded.userId) {
        Model = UserModel;
        id = decoded.userId;
      } else {
        return Response.fail(req, res, 400, 'Invalid token');
      }
      
      const { currentPassword, newPassword, confirmNewPassword } = req.body;
      
      // Kiểm tra các trường bắt buộc
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        return Response.fail(req, res, 400, 'Vui lòng nhập đầy đủ thông tin');
      }
      
      // Kiểm tra xác nhận mật khẩu mới
      if (newPassword !== confirmNewPassword) {
        return Response.fail(req, res, 400, 'Mật khẩu mới và xác nhận mật khẩu không khớp');
      }
      
      // Lấy thông tin người dùng hiện tại bao gồm mật khẩu
      const currentUser = await Model.findOne({
        where: { id, deletedAt: null }
      });
      
      if (!currentUser) {
        return Response.fail(req, res, 404, 'Không tìm thấy người dùng');
      }
      
      // Kiểm tra mật khẩu hiện tại
      const isPasswordValid = await bcrypt.compare(currentPassword, currentUser.password);
      
      if (!isPasswordValid) {
        return Response.fail(req, res, 400, 'Mật khẩu hiện tại không đúng');
      }
      
      // Mã hóa mật khẩu mới
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Cập nhật mật khẩu
      await Model.update(
        { 
          password: hashedPassword,
          confirmPassword: hashedPassword
        },
        {
          where: { id, deletedAt: null }
        }
      );
      
      return Response.success(req, res, { message: 'Đổi mật khẩu thành công' });
    } catch (error) {
      console.error('Change password error:', error);
      return Response.fail(req, res, 500, 'Server error');
    }
  }
};