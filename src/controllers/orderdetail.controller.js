const orderDetailRepository = require('../repositories/orderdetail.repository');
const Response = require('../helpers/response');

module.exports = {
  // Lấy danh sách order details
  getOrderDetails: (req, res) => {
    orderDetailRepository.get(req, res, (data) => {
      if (data) {
        return Response.success(req, res, data, 200);
      } else {
        return Response.fail(req, res, 500, 'Failed to retrieve order details');
      }
    });
  },

  // Lấy order detail theo ID
  getOrderDetailById: (req, res) => {
    orderDetailRepository.getById(req, res, (data) => {
      if (data) {
        return Response.success(req, res, data, 200);
      } else {
        return Response.fail(req, res, 404, 'Order detail not found');
      }
    });
  },

  // Lấy order details theo order ID
  getOrderDetailsByOrderId: (req, res) => {
    orderDetailRepository.getByOrderId(req, res, (data) => {
      if (data) {
        return Response.success(req, res, data, 200);
      } else {
        return Response.fail(req, res, 404, 'Order details not found');
      }
    });
  },

  // Tạo order detail mới
  createOrderDetail: async (req, res) => {
    try {
      // Validate required fields
      const { orderId, productId, quantity, unit_price } = req.body;

      if (!orderId || !productId || !quantity || !unit_price) {
        return Response.fail(req, res, 400, 'Missing required fields: orderId, productId, quantity, unit_price');
      }

      if (quantity <= 0) {
        return Response.fail(req, res, 400, 'Quantity must be greater than 0');
      }

      if (unit_price < 0) {
        return Response.fail(req, res, 400, 'Unit price must be non-negative');
      }

      orderDetailRepository.create(req, res, (data) => {
        if (data) {
          return Response.success(req, res, data, 201);
        } else {
          return Response.fail(req, res, 500, 'Failed to create order detail');
        }
      });
    } catch (error) {
      console.error('Error in createOrderDetail controller:', error);
      return Response.fail(req, res, 500, 'Internal server error');
    }
  },

  // Tạo nhiều order details cùng lúc
  createBulkOrderDetails: async (req, res) => {
    try {
      const orderDetails = req.body.orderDetails || req.body;
      
      if (!Array.isArray(orderDetails) || orderDetails.length === 0) {
        return Response.fail(req, res, 400, 'Order details must be a non-empty array');
      }

      // Validate từng order detail
      for (let i = 0; i < orderDetails.length; i++) {
        const detail = orderDetails[i];
        if (!detail.orderId || !detail.productId || !detail.quantity || !detail.unit_price) {
          return Response.fail(req, res, 400, `Missing required fields in order detail at index ${i}`);
        }

        if (detail.quantity <= 0) {
          return Response.fail(req, res, 400, `Quantity must be greater than 0 at index ${i}`);
        }

        if (detail.unit_price < 0) {
          return Response.fail(req, res, 400, `Unit price must be non-negative at index ${i}`);
        }
      }

      orderDetailRepository.createBulk(req, res, (data) => {
        if (data) {
          return Response.success(req, res, data, 201);
        } else {
          return Response.fail(req, res, 500, 'Failed to create order details');
        }
      });
    } catch (error) {
      console.error('Error in createBulkOrderDetails controller:', error);
      return Response.fail(req, res, 500, 'Internal server error');
    }
  },

  // Cập nhật order detail
  updateOrderDetail: (req, res) => {
    const { quantity, unit_price } = req.body;

    if (quantity !== undefined && quantity <= 0) {
      return Response.fail(req, res, 400, 'Quantity must be greater than 0');
    }

    if (unit_price !== undefined && unit_price < 0) {
      return Response.fail(req, res, 400, 'Unit price must be non-negative');
    }

    orderDetailRepository.update(req, res, (data) => {
      if (data) {
        return Response.success(req, res, data, 200);
      } else {
        return Response.fail(req, res, 404, 'Order detail not found or failed to update');
      }
    });
  },

  // Xóa order detail
  deleteOrderDetail: (req, res) => {
    orderDetailRepository.delete(req, res, (data) => {
      if (data) {
        return Response.success(req, res, { message: 'Order detail deleted successfully' }, 200);
      } else {
        return Response.fail(req, res, 404, 'Order detail not found');
      }
    });
  }
};
