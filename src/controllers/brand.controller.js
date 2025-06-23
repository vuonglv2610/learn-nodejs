const Response = require('../helpers/response');
const BrandRepository = require('../repositories/brand.repository');

module.exports = {
  getList: (req, res) => {
    BrandRepository.get(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res);
      }
      return Response.success(req, res, result);
    });
  },

  getOne: (req, res) => {
    BrandRepository.getOne(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res, 404, 'Thương hiệu không tồn tại');
      }
      return Response.success(req, res, result);
    });
  },

  create: (req, res) => {
    BrandRepository.create(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res);
      }
      return Response.success(req, res, result);
    });
  },

  edit: (req, res) => {
    BrandRepository.edit(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res);
      }
      return Response.success(req, res, result);
    });
  },

  remove: (req, res) => {
    BrandRepository.remove(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res, 404, 'Thương hiệu không tồn tại');
      }
      return Response.success(req, res, { message: 'Xóa thương hiệu thành công' });
    });
  }
};