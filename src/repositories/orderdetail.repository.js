const OrderDetail = require('../models/orderdetail.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');

module.exports = {
  get: async (req, res, result) => {
    try {
      // Xây dựng điều kiện query
      const whereCondition = {
        deletedAt: null,
      };

      // Tìm kiếm theo orderId
      if (req.query.orderId) {
        whereCondition.orderId = req.query.orderId;
      }

      // Tìm kiếm theo productId
      if (req.query.productId) {
        whereCondition.productId = req.query.productId;
      }

      const orderDetails = await OrderDetail.findAll({
        where: whereCondition,
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'sku', 'price', 'img']
          },
          {
            model: Order,
            as: 'order',
            attributes: ['id', 'order_date', 'status', 'total_amount']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      result(orderDetails);
    } catch (error) {
      console.error('Error fetching order details:', error);
      result(null);
    }
  },

  getById: async (req, res, result) => {
    try {
      const id = req.params.id;
      const orderDetail = await OrderDetail.findOne({
        where: {
          id: id,
          deletedAt: null,
        },
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'sku', 'price', 'img', 'description']
          },
          {
            model: Order,
            as: 'order',
            attributes: ['id', 'order_date', 'status', 'total_amount']
          }
        ]
      });

      if (!orderDetail) {
        return result(null);
      }

      result(orderDetail);
    } catch (error) {
      console.error('Error fetching order detail by ID:', error);
      result(null);
    }
  },

  getByOrderId: async (req, res, result) => {
    try {
      const orderId = req.params.orderId;

      const orderDetails = await OrderDetail.findAll({
        where: {
          orderId: orderId,
          deletedAt: null,
        },
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'sku', 'price', 'img']
          }
        ],
        order: [['createdAt', 'ASC']]
      });

      result(orderDetails);
    } catch (error) {
      console.error('Error fetching order details by order ID:', error);
      result(null);
    }
  },

  create: async (req, res, result) => {
    try {
      const orderDetail = await OrderDetail.create(req.body);
      
      // Lấy thông tin chi tiết với include
      const createdOrderDetail = await OrderDetail.findOne({
        where: { id: orderDetail.id },
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'sku', 'price', 'img']
          },
          {
            model: Order,
            as: 'order',
            attributes: ['id', 'order_date', 'status', 'total_amount']
          }
        ]
      });
      
      result(createdOrderDetail);
    } catch (error) {
      console.error('Error creating order detail:', error);
      result(null);
    }
  },

  createBulk: async (req, res, result) => {
    try {
      const orderDetails = req.body.orderDetails || req.body;
      
      if (!Array.isArray(orderDetails)) {
        throw new Error('Order details must be an array');
      }

      const createdOrderDetails = await OrderDetail.bulkCreate(orderDetails);
      
      // Lấy thông tin chi tiết với include
      const detailedOrderDetails = await OrderDetail.findAll({
        where: {
          id: createdOrderDetails.map(od => od.id)
        },
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'sku', 'price', 'img']
          }
        ]
      });
      
      result(detailedOrderDetails);
    } catch (error) {
      console.error('Error creating bulk order details:', error);
      result(null);
    }
  },

  update: async (req, res, result) => {
    try {
      const id = req.params.id;
      const [updatedRowsCount] = await OrderDetail.update(req.body, {
        where: {
          id: id,
          deletedAt: null,
        }
      });

      if (updatedRowsCount === 0) {
        return result(null);
      }

      // Lấy thông tin đã cập nhật
      const updatedOrderDetail = await OrderDetail.findOne({
        where: { id: id },
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'sku', 'price', 'img']
          },
          {
            model: Order,
            as: 'order',
            attributes: ['id', 'order_date', 'status', 'total_amount']
          }
        ]
      });

      result(updatedOrderDetail);
    } catch (error) {
      console.error('Error updating order detail:', error);
      result(null);
    }
  },

  delete: async (req, res, result) => {
    try {
      const id = req.params.id;
      const deletedRowsCount = await OrderDetail.destroy({
        where: {
          id: id,
        }
      });

      if (deletedRowsCount === 0) {
        return result(null);
      }

      result({ message: 'Order detail deleted successfully' });
    } catch (error) {
      console.error('Error deleting order detail:', error);
      result(null);
    }
  }
};
