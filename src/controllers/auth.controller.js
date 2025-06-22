const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const CustomerModel = require('../models/customer.model');
const Response = require('../helpers/response');
const { v4: uuidv4 } = require('uuid');
const { sendEmailService } = require('../services/emailService.js');

module.exports = {
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      let account;
      let accountType;
      
      // Tìm kiếm trong cả hai bảng
      account = await CustomerModel.findOne({ where: { email } });
      if (account) {
        accountType = 'customer';
      } else {
        account = await UserModel.findOne({ where: { email } });
        if (account) {
          accountType = 'user';
        } else {
          return Response.fail(req, res, 400, 'Tài khoản không tồn tại');
        }
      }
      
      // Kiểm tra mật khẩu
      const validPassword = await bcrypt.compare(password, account.password);
      if (!validPassword) {
        return Response.fail(req, res, 400, 'Mật khẩu không đúng');
      }

      // Xác định idField dựa trên accountType
      const idField = accountType === 'customer' ? 'customerId' : 'userId';
      
      // Tạo token
      const tokenPayload = {};
      tokenPayload[idField] = account.id;
      
      const token = jwt.sign(tokenPayload, process.env.KEY_JWT, {
        expiresIn: process.env.EXPIRES_TIME_TOKEN,
      });

      // Chuẩn bị dữ liệu phản hồi
      const responseData = { 
        email, 
        type: accountType,
        name: account.name
      };
      
      // Thêm ID vào response data
      responseData[idField] = account.id;
      
      // Thêm role cho user
      if (accountType === 'user') {
        responseData.role = account.role || account.roleId;
      }

      Response.success(req, res, responseData, 200, token);
    } catch (error) {
      console.error('Login error:', error);
      if (error.name === 'SequelizeDatabaseError') {
        Response.fail(req, res, 400, 'Lỗi database');
      }
      return Response.fail(req, res, 500, 'Errors');
    }
  },

  loginSuccess: async (req, res) => {
    const { id } = req.body;
    try {
      // Tìm customer thay vì user
      const customer = await CustomerModel.findOne({ 
        where: { id },
        attributes: { exclude: ['password', 'confirmPassword'] }
      });
      
      if (!customer) {
        return Response.fail(req, res, 400, 'Khách hàng không tồn tại');
      }

      // Tạo token với customerId thay vì userId
      const token = jwt.sign({ customerId: customer.id }, process.env.KEY_JWT, {
        expiresIn: process.env.EXPIRES_TIME_TOKEN,
      });
      Response.success(
        req,
        res,
        { 
          email: customer.email, 
          customerId: customer.id, 
          name: customer.name,
          type: 'customer'
        },
        200,
        token
      );
    } catch (error) {
      if (error.name === 'SequelizeDatabaseError') {
        return Response.fail(req, res, 400, 'Lỗi database');
      }
      return Response.fail(req, res, 500, 'Errors', error);
    }
  },

  register: async (req, res) => {
    try {
      const { name, email, password, confirmPassword } = req.body;
      if (password !== confirmPassword)
        return Response.fail(
          req,
          res,
          400,
          'confirm password different password'
        );
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await CustomerModel.create({
        id: uuidv4(),
        name,
        email,
        password: hashedPassword,
        confirmPassword: hashedPassword,
        roleId: 1,
      });
      await sendEmailService(email);
      Response.success(req, res, user, 200);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        Response.fail(req, res, 400, 'Email đã tồn tại');
      } else {
        Response.fail(req, res, 500, error);
      }
    }
  },
};





