const Response = require('../helpers/response');
const UserRepository = require('../repositories/user.repository');

module.exports = {
  getList: (req, res) => {
    // todo: validator
    UserRepository.get(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res);
      }
      return Response.success(req, res, result);
    });
  },

  getOne: (req, res) => {
    UserRepository.getOne(req, res, (result) => {
      if (!result || result.length === 0) {
        return Response.fail(req, res, 404);
      }
      return Response.success(req, res, result);
    });
  },

  create: (req, res) => {
    UserRepository.create(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res);
      }
      return Response.success(req, res, result);
    });
  },

  edit: (req, res) => {
    UserRepository.edit(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res);
      }
      return Response.success(req, res, result);
    });
  },

  remove: (req, res) => {
    UserRepository.remove(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res);
      }
      return Response.success(req, res, result);
    });
  },
};

