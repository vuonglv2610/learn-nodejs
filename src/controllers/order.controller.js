const OrderRepository = require('../repositories/order.repository');
const Response = require('../helpers/response');

module.exports = {
  getList: (req, res) => {
    OrderRepository.get(req, res, (data) => {
      if (!data) {
        return Response.fail(req, res, 500, 'Lỗi khi lấy danh sách đơn hàng');
      }
      return Response.success(req, res, 200, 'Lấy danh sách đơn hàng thành công', data);
    });
  },

  getOne: (req, res) => {
    OrderRepository.getById(req, res, (data) => {
      if (!data) {
        return Response.fail(req, res, 404, 'Không tìm thấy đơn hàng');
      }
      return Response.success(req, res, 200, 'Lấy thông tin đơn hàng thành công', data);
    });
  },

  getByCustomer: (req, res) => {
    OrderRepository.getByCustomer(req, res, (data) => {
      if (!data) {
        return Response.fail(req, res, 404, 'Không tìm thấy đơn hàng cho khách hàng này');
      }
      return Response.success(req, res, 200, 'Lấy danh sách đơn hàng theo khách hàng thành công', data);
    });
  },

  create: (req, res) => {
    OrderRepository.create(req, res, (data) => {
      if (!data) {
        return Response.fail(req, res, 500, 'Lỗi khi tạo đơn hàng');
      }
      return Response.success(req, res, 201, 'Tạo đơn hàng thành công', data);
    });
  },

  edit: (req, res) => {
    OrderRepository.update(req, res, (data) => {
      if (!data) {
        return Response.fail(req, res, 404, 'Không tìm thấy đơn hàng để cập nhật');
      }
      return Response.success(req, res, 200, 'Cập nhật đơn hàng thành công', data);
    });
  },

  remove: (req, res) => {
    OrderRepository.delete(req, res, (data) => {
      if (!data) {
        return Response.fail(req, res, 404, 'Không tìm thấy đơn hàng để xóa');
      }
      return Response.success(req, res, 200, 'Xóa đơn hàng thành công', data);
    });
  }
};