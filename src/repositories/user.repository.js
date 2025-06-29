const UserModel = require('../models/user.model');
const RoleModel = require('../models/role.model');
const { Op } = require('sequelize');
const Response = require('../helpers/response');

module.exports = {
  get: async (req, res, result) => {
    try {
      // Xây dựng điều kiện query
      const whereCondition = {
        deletedAt: null,
      };
      
      // Tìm kiếm theo tên người dùng
      if (req.query.name) {
        whereCondition.name = {
          [Op.like]: `%${req.query.name}%`
        };
      }
      
      // Tìm kiếm theo email
      if (req.query.email) {
        whereCondition.email = {
          [Op.like]: `%${req.query.email}%`
        };
      }
      
      // Tìm kiếm theo vai trò
      if (req.query.roleId) {
        whereCondition.roleId = req.query.roleId;
      }
      
      // Xử lý sắp xếp
      const order = [];
      if (req.query.sort_by) {
        order.push([req.query.sort_by, req.query.sort_order || 'ASC']);
      } else {
        order.push(['createdAt', 'DESC']);
      }
      
      // Chuẩn bị options cho query
      const queryOptions = {
        where: whereCondition,
        attributes: { exclude: ['password', 'confirmPassword'] },
        include: [
          {
            model: RoleModel,
            as: 'role',
            attributes: ['id', 'role', 'role_key']
          }
        ],
        order: order
      };
      
      const users = await UserModel.findAll(queryOptions);
      
      // Format dữ liệu trực tiếp trong repository
      const formattedUsers = users.map(user => {
        const userData = user.toJSON();
        
        // Thêm các trường phẳng từ đối tượng role
        if (userData.role) {
          userData.roleName = userData.role.role;
          userData.roleKey = userData.role.role_key;
          // Xóa đối tượng role để tránh lỗi ở frontend
          delete userData.role;
        }
        
        return userData;
      });
      
      // Trả về tất cả người dùng
      result(formattedUsers);
    } catch (error) {
      console.error('Error executing query:', error);
      result(null);
    }
  },

  getOne: async (req, res, result) => {
    try {
      const user = await UserModel.findOne({
        where: {
          id: req.params.id,
          deletedAt: null,
        },
        attributes: { exclude: ['password', 'confirmPassword'] },
        include: [
          {
            model: RoleModel,
            as: 'role',
            attributes: ['id', 'role', 'role_key']
          }
        ]
      });
      
      if (user) {
        const userData = user.toJSON();
        
        // Thêm các trường phẳng từ đối tượng role
        if (userData.role) {
          userData.roleName = userData.role.role;
          userData.roleKey = userData.role.role_key;
          // Xóa đối tượng role để tránh lỗi ở frontend
          delete userData.role;
        }
        
        result(userData);
      } else {
        result(null);
      }
    } catch (error) {
      console.error('Error executing query:', error);
      result(null);
    }
  },

  create: async (req, res, result) => {
    try {
      const { password, ...userData } = req.body;
      let hashedPassword = null;

      // Hash password nếu có
      if (password) {
        const bcrypt = require('bcrypt');
        hashedPassword = await bcrypt.hash(password, 10);
      }

      const user = await UserModel.create({
        ...userData,
        password: hashedPassword,
        confirmPassword: hashedPassword,
      });

      // Loại bỏ password khỏi response
      const { password: pwd, confirmPassword, ...userResponse } = user.toJSON();
      result(userResponse);
    } catch (error) {
      console.error('Error creating user:', error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        return Response.fail(req, res, 400, 'Email đã tồn tại');
      } else {
        return Response.fail(req, res, 500, 'Lỗi khi tạo người dùng');
      }
    }
  },

  edit: async (req, res, result) => {
    const id = req.params.id;
    try {
      const updateData = { ...req.body };

      // Nếu có cập nhật mật khẩu
      if (updateData.password) {
        const bcrypt = require('bcrypt');
        updateData.password = await bcrypt.hash(updateData.password, 10);
        updateData.confirmPassword = updateData.password;
      }

      await UserModel.update(updateData, {
        where: {
          id,
          deletedAt: null,
        },
      });

      const updatedUser = await UserModel.findByPk(id, {
        attributes: { exclude: ['password', 'confirmPassword'] }
      });
      result(updatedUser);
    } catch (error) {
      console.error('Error updating users:', error);
      return Response.fail(req, res, 500, 'Lỗi khi cập nhật người dùng');
    }
  },

  remove: async (req, res, result) => {
    try {
      const user = await UserModel.destroy({
        where: {
          id: req.params.id,
        },
      });
      result(user);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  },
};



