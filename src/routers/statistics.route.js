const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statistics.controller');
const { authMiddleware, requireAdmin } = require('../middleware/auth.middleware');

// Middleware xác thực cho tất cả routes thống kê (chỉ admin mới được xem)
router.use(authMiddleware, requireAdmin);

/**
 * @route GET /api/statistics/dashboard
 * @desc Lấy thống kê tổng quan cho dashboard
 * @access Private (Admin only)
 */
router.get('/dashboard', statisticsController.getDashboard);

/**
 * @route GET /api/statistics/revenue
 * @desc Lấy thống kê doanh thu theo thời gian
 * @query startDate, endDate, groupBy (day/month/year)
 * @access Private (Admin only)
 */
router.get('/revenue', statisticsController.getRevenue);

/**
 * @route GET /api/statistics/revenue/comparison
 * @desc So sánh doanh thu giữa 2 kỳ
 * @query currentStart, currentEnd, previousStart, previousEnd
 * @access Private (Admin only)
 */
router.get('/revenue/comparison', statisticsController.getRevenueComparison);

/**
 * @route GET /api/statistics/orders
 * @desc Lấy thống kê đơn hàng theo trạng thái
 * @query startDate, endDate
 * @access Private (Admin only)
 */
router.get('/orders', statisticsController.getOrders);

/**
 * @route GET /api/statistics/products/top
 * @desc Lấy top sản phẩm bán chạy
 * @query startDate, endDate, limit
 * @access Private (Admin only)
 */
router.get('/products/top', statisticsController.getTopProducts);

/**
 * @route GET /api/statistics/customers
 * @desc Lấy thống kê khách hàng
 * @query startDate, endDate
 * @access Private (Admin only)
 */
router.get('/customers', statisticsController.getCustomers);

/**
 * @route GET /api/statistics/categories
 * @desc Lấy thống kê theo danh mục sản phẩm
 * @query startDate, endDate
 * @access Private (Admin only)
 */
router.get('/categories', statisticsController.getCategories);

/**
 * @route GET /api/statistics/brands
 * @desc Lấy thống kê theo thương hiệu
 * @query startDate, endDate
 * @access Private (Admin only)
 */
router.get('/brands', statisticsController.getBrands);

/**
 * @route GET /api/statistics/payment-methods
 * @desc Lấy thống kê phương thức thanh toán
 * @query startDate, endDate
 * @access Private (Admin only)
 */
router.get('/payment-methods', statisticsController.getPaymentMethods);

module.exports = router;
