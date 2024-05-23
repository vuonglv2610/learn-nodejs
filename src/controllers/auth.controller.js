const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const Response = require('../helpers/response');

module.exports = {
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await UserModel.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: 'Người dùng không tồn tại' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: 'Mật khẩu không đúng' });
      }
      const token = jwt.sign({ userId: user.id }, 'secretkey', {
        expiresIn: '1h',
      });
      Response.success(res, res, { email }, 200, token);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Có lỗi xảy ra' });
    }
  },

  register: async (req, res) => {
    try {
      const { name, email, password, roleId } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await UserModel.create({
        name,
        email,
        password: hashedPassword,
        roleId,
      });
      Response.success(req, res, user, 200);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        Response.fail(req, res, 400, 'Email đã tồn tại');
      } else {
        console.error(error);
        res.status(500).json({ error: 'Có lỗi xảy ra' });
      }
    }
  },
};

