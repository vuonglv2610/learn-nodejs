const Response = require('../helpers/response');
const CustomerRepository = require('../repositories/customer.repository');

module.exports = {
  getList: (req, res) => {
    CustomerRepository.get(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res);
      }
      return Response.success(req, res, result);
    });
  },

  getOne: (req, res) => {
    CustomerRepository.getOne(req, res, (result) => {
      if (!result || result.length === 0) {
        return Response.fail(req, res, 404);
      }
      return Response.success(req, res, result);
    });
  },

  create: (req, res) => {
    CustomerRepository.create(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res);
      }
      return Response.success(req, res, result);
    });
  },

  edit: (req, res) => {
    CustomerRepository.edit(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res);
      }
      return Response.success(req, res, result);
    });
  },

  remove: (req, res) => {
    CustomerRepository.remove(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res);
      }
      return Response.success(req, res, result);
    });
  },
};