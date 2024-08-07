const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const Response = require('../helpers/response');
const { v4: uuidv4 } = require('uuid');
const { sendEmailService } = require('../services/emailService.js');

module.exports = {
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await UserModel.findOne({ where: { email } });
      if (!user) {
        return Response.fail(req, res, 400, 'Người dùng không tồn tại');
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return Response.fail(req, res, 400, 'Mật khẩu không đúng');
      }
      const token = jwt.sign({ userId: user.id }, process.env.KEY_JWT, {
        expiresIn: process.env.EXPIRES_TIME_TOKEN,
      });
      Response.success(
        req,
        res,
        { email, userId: user.id, role: user.role },
        200,
        token
      );
    } catch (error) {
      if (error.name === 'SequelizeDatabaseError') {
        Response.fail(req, res, 400, 'Email không tồn tại');
      }
      return Response.fail(req, res, 500, 'Errors');
    }
  },

  loginSuccess: async (req, res) => {
    const { id } = req.body;
    try {
      const user = await UserModel.findOne({ where: { id } });
      if (!user) {
        return Response.fail(req, res, 400, 'Người dùng không tồn tại');
      }

      const token = jwt.sign({ userId: user.id }, process.env.KEY_JWT, {
        expiresIn: process.env.EXPIRES_TIME_TOKEN,
      });
      Response.success(
        req,
        res,
        { email: user.email, userId: user.id, role: user.role },
        200,
        token
      );
    } catch (error) {
      if (error.name === 'SequelizeDatabaseError') {
        Response.fail(req, res, 400, 'Email không tồn tại');
      }
      return Response.fail(req, res, 500, 'Errors');
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
      const user = await UserModel.create({
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

