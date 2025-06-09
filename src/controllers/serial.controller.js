const Response = require('../helpers/response');
const SerialRepository = require('../repositories/serial.repository');

module.exports = {
  getList: (req, res) => {
    SerialRepository.get(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res);
      }
      return Response.success(req, res, result);
    });
  },

  getOne: (req, res) => {
    SerialRepository.getOne(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res, 404, 'Serial không tồn tại');
      }
      return Response.success(req, res, result);
    });
  },

  getByProductId: (req, res) => {
    SerialRepository.getByProductId(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res);
      }
      return Response.success(req, res, result);
    });
  },

  create: (req, res) => {
    SerialRepository.create(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res);
      }
      return Response.success(req, res, result);
    });
  },

  edit: (req, res) => {
    SerialRepository.edit(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res);
      }
      return Response.success(req, res, result);
    });
  },

  remove: (req, res) => {
    SerialRepository.remove(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res, 404, 'Serial không tồn tại');
      }
      return Response.success(req, res, { message: 'Xóa serial thành công' });
    });
  },

  bulkCreate: (req, res) => {
    SerialRepository.bulkCreate(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res);
      }
      return Response.success(req, res, result);
    });
  }
};