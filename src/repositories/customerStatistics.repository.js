const { Op, Sequelize } = require('sequelize');
const OrderModel = require('../models/order.model');
const PaymentModel = require('../models/payment.model');
const sequelize = require('../models/db');

module.exports = {
  /**
   * Lấy thống kê đơn hàng và chi tiêu của customer
   * @param {string} customerId - ID của customer
   * @returns {Object} Thống kê customer
   */
  getCustomerStatistics: async (customerId) => {
    try {
      // 1. Thống kê đơn hàng theo trạng thái
      const orderStats = await OrderModel.findAll({
        attributes: [
          'status',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
          [Sequelize.fn('SUM', Sequelize.col('total_amount')), 'total_amount']
        ],
        where: {
          customerId: customerId,
          deletedAt: null
        },
        group: ['status'],
        raw: true
      });

      // 2. Tổng số đơn hàng
      const totalOrders = await OrderModel.count({
        where: {
          customerId: customerId,
          deletedAt: null
        }
      });

      // 3. Tổng chi tiêu (từ payments đã thanh toán)
      const totalSpent = await PaymentModel.sum('finalAmount', {
        where: {
          customerId: customerId,
          paymentStatus: 'paid',
          deletedAt: null
        }
      }) || 0;

      // 4. Xử lý dữ liệu trạng thái đơn hàng
      const statusCounts = {
        total: totalOrders,
        pending: 0,
        confirmed: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
      };

      let completedOrders = 0;
      let processingOrders = 0;

      orderStats.forEach(stat => {
        const status = stat.status;
        const count = parseInt(stat.count);
        
        statusCounts[status] = count;
        
        // Đơn hàng đã hoàn thành (delivered)
        if (status === 'delivered') {
          completedOrders += count;
        }
        
        // Đơn hàng đang xử lý (confirmed, processing, shipped)
        if (['confirmed', 'processing', 'shipped'].includes(status)) {
          processingOrders += count;
        }
      });

      // 5. Thống kê theo tháng (6 tháng gần nhất)
      const monthlyStats = await sequelize.query(`
        SELECT 
          DATE_FORMAT(o.createdAt, '%Y-%m') as month,
          COUNT(o.id) as order_count,
          COALESCE(SUM(p.finalAmount), 0) as total_spent
        FROM orders o
        LEFT JOIN payments p ON o.id = p.orderId AND p.paymentStatus = 'paid'
        WHERE o.customerId = :customerId 
          AND o.deletedAt IS NULL
          AND o.createdAt >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(o.createdAt, '%Y-%m')
        ORDER BY month DESC
      `, {
        replacements: { customerId },
        type: Sequelize.QueryTypes.SELECT
      });

      // 6. Đơn hàng gần nhất
      const recentOrders = await OrderModel.findAll({
        where: {
          customerId: customerId,
          deletedAt: null
        },
        attributes: ['id', 'order_date', 'status', 'total_amount'],
        order: [['createdAt', 'DESC']],
        limit: 5
      });

      return {
        summary: {
          totalOrders: totalOrders,
          completedOrders: completedOrders,
          processingOrders: processingOrders,
          totalSpent: parseFloat(totalSpent.toFixed(2))
        },
        ordersByStatus: statusCounts,
        monthlyStats: monthlyStats,
        recentOrders: recentOrders
      };

    } catch (error) {
      console.error('Error in getCustomerStatistics:', error);
      throw error;
    }
  },

  /**
   * Lấy thống kê chi tiết thanh toán của customer
   * @param {string} customerId - ID của customer
   * @returns {Object} Thống kê thanh toán
   */
  getCustomerPaymentStatistics: async (customerId) => {
    try {
      const paymentStats = await PaymentModel.findAll({
        attributes: [
          'paymentStatus',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
          [Sequelize.fn('SUM', Sequelize.col('finalAmount')), 'total_amount']
        ],
        where: {
          customerId: customerId,
          deletedAt: null
        },
        group: ['paymentStatus'],
        raw: true
      });

      const result = {
        pending: { count: 0, amount: 0 },
        paid: { count: 0, amount: 0 },
        failed: { count: 0, amount: 0 },
        refunded: { count: 0, amount: 0 }
      };

      paymentStats.forEach(stat => {
        const status = stat.paymentStatus;
        result[status] = {
          count: parseInt(stat.count),
          amount: parseFloat((stat.total_amount || 0).toFixed(2))
        };
      });

      return result;
    } catch (error) {
      console.error('Error in getCustomerPaymentStatistics:', error);
      throw error;
    }
  }
};
