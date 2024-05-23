const Response = require('../helpers/response');
const ProductRepository = require('../repositories/product.repository');

module.exports = {
  getList: (req, res) => {
    // todo: validator
    ProductRepository.get(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res);
      }
      return Response.success(req, res, result);
    });
  },

  getOne: (req, res) => {
    ProductRepository.getOne(req, res, (result) => {
      if (!result || result.length === 0) {
        return Response.fail(req, res, 404);
      }
      return Response.success(req, res, result);
    });
  },

  create: (req, res) => {
    ProductRepository.create(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res);
      }
      return Response.success(req, res, result);
    });
  },

  edit: (req, res) => {
    ProductRepository.edit(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res);
      }
      return Response.success(req, res, result);
    });
  },

  remove: (req, res) => {
    ProductRepository.remove(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res);
      }
      return Response.success(req, res, result);
    });
  },
};