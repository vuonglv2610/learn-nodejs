const express = require('express');
const router = express.Router();
const customerStatisticsController = require('../controllers/customerStatistics.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const Response = require('../helpers/response');

// Middleware để kiểm tra customer authentication
const requireCustomer = (req, res, next) => {
  // Kiểm tra xem user có phải là customer không
  if (!req.customer) {
    return Response.fail(req, res, 403, 'Chỉ khách hàng mới có thể truy cập API này');
  }
  next();
};

// Tất cả routes đều cần authentication và phải là customer
router.use(authMiddleware, requireCustomer);

/**
 * @route GET /api/customer-statistics/overview
 * @desc Lấy thống kê tổng quan của customer (tổng đơn hàng, đã hoàn thành, đang xử lý, tổng chi tiêu)
 * @access Private (Customer only)
 * @returns {Object} {
 *   summary: {
 *     totalOrders: number,
 *     completedOrders: number,
 *     processingOrders: number,
 *     totalSpent: number
 *   },
 *   ordersByStatus: {
 *     total: number,
 *     pending: number,
 *     confirmed: number,
 *     processing: number,
 *     shipped: number,
 *     delivered: number,
 *     cancelled: number
 *   },
 *   monthlyStats: Array,
 *   recentOrders: Array
 * }
 */
router.get('/overview', customerStatisticsController.getOverview);

/**
 * @route GET /api/customer-statistics/payments
 * @desc Lấy thống kê thanh toán của customer
 * @access Private (Customer only)
 * @returns {Object} {
 *   pending: { count: number, amount: number },
 *   paid: { count: number, amount: number },
 *   failed: { count: number, amount: number },
 *   refunded: { count: number, amount: number }
 * }
 */
router.get('/payments', customerStatisticsController.getPaymentStatistics);

/**
 * @route GET /api/customer-statistics/summary
 * @desc Lấy tổng hợp thống kê (orders + payments)
 * @access Private (Customer only)
 * @returns {Object} {
 *   orders: Object, // từ /overview
 *   payments: Object, // từ /payments
 *   customerId: string
 * }
 */
router.get('/summary', customerStatisticsController.getSummary);

module.exports = router;
