const Response = require('../helpers/reponse');
const ProductModel = require('../models/product.model');

module.exports = {
  getList: (req, res) => {
    ProductModel.get(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res);
      }
      return Response.success(req, res, result);
    });
  },

  getOne: (req, res) => {
    ProductModel.getOne(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res);
      }
      return Response.success(req, res, result);
    });
  },

  create: (req, res) => {
    ProductModel.create(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res);
      }
      return Response.success(req, res, result);
    });
  },

  edit: (req, res, result) => {
    if (!result) {
      return Response.fail(req, res);
    }
    return Response.success(req, res, result);
  },

  remove: (req, res, result) => {
    if (!result) {
      return Response.fail(req, res);
    }
    return Response.success(req, res, result);
  },
};

