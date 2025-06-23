const Response = require('../helpers/response');
const VoucherRepository = require('../repositories/voucher.repository');

module.exports = {
  getList: (req, res) => {
    VoucherRepository.get(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res);
      }
      return Response.success(req, res, result);
    });
  },

  getOne: (req, res) => {
    VoucherRepository.getOne(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res, 404, 'Voucher không tồn tại');
      }
      return Response.success(req, res, result);
    });
  },

  getByCode: (req, res) => {
    VoucherRepository.getByCode(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res, 404, 'Voucher không tồn tại hoặc đã hết hạn');
      }
      return Response.success(req, res, result);
    });
  },

  create: (req, res) => {
    VoucherRepository.create(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res);
      }
      return Response.success(req, res, result);
    });
  },

  edit: (req, res) => {
    VoucherRepository.edit(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res);
      }
      return Response.success(req, res, result);
    });
  },

  remove: (req, res) => {
    VoucherRepository.remove(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res, 404, 'Voucher không tồn tại');
      }
      return Response.success(req, res, { message: 'Xóa voucher thành công' });
    });
  }
};