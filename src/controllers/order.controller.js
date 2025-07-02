const OrderRepository = require('../repositories/order.repository');
const OrderService = require('../services/orderService');
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
  },

  // Tạo order cùng với order details
  createWithDetails: async (req, res) => {
    try {
      const { orderData, orderItems, customerId } = req.body;

      if (!customerId) {
        return Response.fail(req, res, 400, 'Customer ID is required');
      }

      if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
        return Response.fail(req, res, 400, 'Order items are required and must be a non-empty array');
      }

      const result = await OrderService.createOrderWithDetails(orderData || {}, orderItems, customerId);

      return Response.success(req, res, 201, 'Tạo đơn hàng và chi tiết thành công', result);
    } catch (error) {
      console.error('Error in createWithDetails controller:', error);

      // Xử lý các loại lỗi cụ thể
      if (error.message.includes('Customer with ID') && error.message.includes('not found')) {
        return Response.fail(req, res, 404, `Customer không tồn tại: ${error.message}`);
      }

      if (error.message.includes('Product with ID') && error.message.includes('not found')) {
        return Response.fail(req, res, 404, `Product không tồn tại: ${error.message}`);
      }

      if (error.message.includes('foreign key constraint fails')) {
        return Response.fail(req, res, 400, 'Dữ liệu không hợp lệ: Customer ID hoặc Product ID không tồn tại');
      }

      return Response.fail(req, res, 500, error.message || 'Lỗi khi tạo đơn hàng');
    }
  },

  // Lấy order cùng với order details
  getWithDetails: async (req, res) => {
    try {
      const orderId = req.params.id;

      const result = await OrderService.getOrderWithDetails(orderId);

      if (!result) {
        return Response.fail(req, res, 404, 'Không tìm thấy đơn hàng');
      }

      return Response.success(req, res, 200, 'Lấy thông tin đơn hàng và chi tiết thành công', result);
    } catch (error) {
      console.error('Error in getWithDetails controller:', error);
      return Response.fail(req, res, 500, error.message || 'Lỗi khi lấy thông tin đơn hàng');
    }
  },

  // Cập nhật order cùng với order details
  updateWithDetails: async (req, res) => {
    try {
      const orderId = req.params.id;
      const { orderData, orderItems } = req.body;

      const result = await OrderService.updateOrderWithDetails(orderId, orderData || {}, orderItems);

      return Response.success(req, res, 200, 'Cập nhật đơn hàng và chi tiết thành công', result);
    } catch (error) {
      console.error('Error in updateWithDetails controller:', error);
      return Response.fail(req, res, 500, error.message || 'Lỗi khi cập nhật đơn hàng');
    }
  },

  // Xóa order cùng với order details
  deleteWithDetails: async (req, res) => {
    try {
      const orderId = req.params.id;

      const result = await OrderService.deleteOrderWithDetails(orderId);

      return Response.success(req, res, 200, 'Xóa đơn hàng và chi tiết thành công', result);
    } catch (error) {
      console.error('Error in deleteWithDetails controller:', error);
      return Response.fail(req, res, 500, error.message || 'Lỗi khi xóa đơn hàng');
    }
  },

  // Lấy danh sách orders với order details
  getListWithDetails: async (req, res) => {
    try {
      const filters = {};

      // Xử lý filters
      if (req.query.customerId) filters.customerId = req.query.customerId;
      if (req.query.status) filters.status = req.query.status;

      const result = await OrderService.getOrdersWithDetails(filters);

      return Response.success(req, res, result, 200);
    } catch (error) {
      console.error('Error in getListWithDetails controller:', error);
      return Response.fail(req, res, 500, error.message || 'Lỗi khi lấy danh sách đơn hàng');
    }
  }
};