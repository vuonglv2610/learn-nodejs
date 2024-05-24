const UserModel = require('../models/user.model');
const Response = require('../helpers/response');

module.exports = {
  get: async (req, res, result) => {
    try {
      const users = await UserModel.findAll({
        where: {
          deletedAt: null,
        },
        // todo: add conditions query parameters
      });
      result(users);
    } catch (error) {
      console.error('Error executing query:', error);
    }
  },

  getOne: async (req, res, result) => {
    try {
      const user = await UserModel.findOne({
        where: {
          id: req.params.id,
          deletedAt: null,
        },
        // todo: add conditions query parameters
      });
      result(user);
    } catch (error) {
      console.error('Error executing query:', error);
    }
  },

  create: async (req, res, result) => {
    try {
      const user = await UserModel.create(req.body);
      result(user);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        Response.fail(req, res, 400, 'Email đã tồn tại');
      } else {
        return Response.fail(req, res, 500, 'Errors');
      }
    }
  },

  edit: async (req, res, result) => {
    const id = req.params.id;
    try {
      await Product.update(req.body, {
        where: {
          id,
          deletedAt: null,
        },
      });
      const updatedUser = await UserModel.findByPk(id);
      result(updatedUser);
    } catch (error) {
      console.error('Error updating users:', error);
      throw error;
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


