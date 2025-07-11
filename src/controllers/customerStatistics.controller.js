const customerStatisticsRepository = require('../repositories/customerStatistics.repository');
const Response = require('../helpers/response');

module.exports = {
  /**
   * Lấy thống kê tổng quan của customer
   * @route GET /api/customer-statistics/overview
   * @access Private (Customer only - chỉ xem thống kê của chính mình)
   */
  getOverview: async (req, res) => {
    try {
      // Lấy customerId từ token (đã được xác thực qua middleware)
      const customerId = req.customer?.id;

      if (!customerId) {
        return Response.fail(req, res, 400, 'Customer ID không hợp lệ');
      }

      const statistics = await customerStatisticsRepository.getCustomerStatistics(customerId);

      return Response.success(req, res, statistics, 200);
    } catch (error) {
      console.error('Error in getOverview:', error);
      return Response.fail(req, res, 500, 'Lỗi khi lấy thống kê khách hàng');
    }
  },

  /**
   * Lấy thống kê thanh toán của customer
   * @route GET /api/customer-statistics/payments
   * @access Private (Customer only)
   */
  getPaymentStatistics: async (req, res) => {
    try {
      const customerId = req.customer?.id;

      if (!customerId) {
        return Response.fail(req, res, 400, 'Customer ID không hợp lệ');
      }

      const paymentStats = await customerStatisticsRepository.getCustomerPaymentStatistics(customerId);

      return Response.success(req, res, paymentStats, 200);
    } catch (error) {
      console.error('Error in getPaymentStatistics:', error);
      return Response.fail(req, res, 500, 'Lỗi khi lấy thống kê thanh toán');
    }
  },

  /**
   * Lấy thống kê tổng hợp (overview + payments)
   * @route GET /api/customer-statistics/summary
   * @access Private (Customer only)
   */
  getSummary: async (req, res) => {
    try {
      const customerId = req.customer?.id;

      if (!customerId) {
        return Response.fail(req, res, 400, 'Customer ID không hợp lệ');
      }

      // Lấy cả thống kê đơn hàng và thanh toán
      const [orderStats, paymentStats] = await Promise.all([
        customerStatisticsRepository.getCustomerStatistics(customerId),
        customerStatisticsRepository.getCustomerPaymentStatistics(customerId)
      ]);

      const summary = {
        orders: orderStats,
        payments: paymentStats,
        customerId: customerId
      };

      return Response.success(req, res, summary, 200);
    } catch (error) {
      console.error('Error in getSummary:', error);
      return Response.fail(req, res, 500, 'Lỗi khi lấy tổng hợp thống kê');
    }
  }
};
