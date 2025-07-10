const Order = require('../models/order.model');
const Customer = require('../models/customer.model');
const { Op } = require('sequelize');
const sequelize = require('../models/db');

module.exports = {
  get: async (req, res, result) => {
    try {
      // Xây dựng điều kiện query
      const whereCondition = {
        deletedAt: null,
      };
      
      // Tìm kiếm theo customerId
      if (req.query.customer_id) {
        whereCondition.customerId = req.query.customerId;
      }
      
      // Tìm kiếm theo status
      if (req.query.status) {
        whereCondition.status = req.query.status;
      }
      
      // Xử lý sắp xếp
      const order = [];
      if (req.query.sort_by) {
        order.push([req.query.sort_by, req.query.sort_order || 'ASC']);
      } else {
        order.push(['createdAt', 'DESC']);
      }
      
      // Chuẩn bị options cho query
      const queryOptions = {
        where: whereCondition,
        include: [
          {
            model: Customer,
            as: 'customer',
            attributes: ['id', 'name', 'email', 'phone']
          }
        ],
        order: order
      };
      
      const orders = await Order.findAll(queryOptions);
      result(orders);
    } catch (error) {
      console.error('Error executing query:', error);
      result(null);
    }
  },

  getById: async (req, res, result) => {
    try {
      const order = await Order.findByPk(req.params.id, {
        include: [
          {
            model: Customer,
            as: 'customer',
            attributes: ['id', 'name', 'email', 'phone']
          }
        ]
      });
      
      if (!order) {
        return result(null);
      }
      
      result(order);
    } catch (error) {
      console.error('Error executing query:', error);
      result(null);
    }
  },

  getByCustomer: async (req, res, result) => {
    try {
      const customerId = req.params.customerId;

      const orders = await Order.findAll({
        where: {
          customerId: customerId,
          deletedAt: null,
        },
        include: [
          {
            model: Customer,
            as: 'customer',
            attributes: ['id', 'name', 'email', 'phone']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      result(orders);
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      result(null);
    }
  },

  create: async (req, res, result) => {
    try {
      const { total } = req.body;
      req.body.total_amount = total;
      const order = await Order.create(req.body);
      result(order);
    } catch (error) {
      console.error('Error creating order:', error);
      result(null);
    }
  },

  update: async (req, res, result) => {
    const transaction = await sequelize.transaction();

    try {
      const orderId = req.params.id;
      const updateData = req.body;

      const order = await Order.findByPk(orderId, { transaction });

      if (!order) {
        await transaction.rollback();
        return result(null);
      }

      // Lưu trạng thái cũ để so sánh
      const oldStatus = order.status;
      const newStatus = updateData.status;

      console.log(`🔄 Updating order ${orderId} from ${oldStatus} to ${newStatus}`);

      // Cập nhật order
      await order.update(updateData, { transaction });

      // Logic COD: Tự động cập nhật payment status khi order chuyển sang 'delivered'
      if (newStatus === 'delivered' && oldStatus !== 'delivered') {
        console.log('🚚 Order delivered, checking for COD payment...');

        // Tìm payment của order này
        const Payment = require('../models/payment.model');
        const payment = await Payment.findOne({
          where: { orderId: orderId },
          transaction
        });

        if (payment) {
          console.log(`💳 Found payment: method=${payment.paymentMethod}, status=${payment.paymentStatus}`);

          // Nếu là COD và chưa thanh toán, tự động chuyển sang 'paid'
          if (payment.paymentMethod === 'cash' && payment.paymentStatus === 'pending') {
            await payment.update({
              paymentStatus: 'paid',
              paymentDate: new Date(),
              updatedAt: new Date()
            }, { transaction });

            console.log('💰 COD payment automatically updated to paid for order:', orderId);
          } else {
            console.log(`ℹ️ Payment not updated: method=${payment.paymentMethod}, status=${payment.paymentStatus}`);
          }
        } else {
          console.log('⚠️ No payment found for order:', orderId);
        }
      }

      await transaction.commit();
      console.log('✅ Order update completed successfully');
      result(order);
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Error updating order:', error);
      result(null);
    }
  },

  delete: async (req, res, result) => {
    try {
      const order = await Order.findByPk(req.params.id);
      
      if (!order) {
        return result(null);
      }
      
      await order.destroy();
      result(order);
    } catch (error) {
      console.error('Error deleting order:', error);
      result(null);
    }
  }
};