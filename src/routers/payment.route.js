const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/payment.controller');
const customerAuthMiddleware = require('../middleware/customer-auth.middleware');

// Lấy danh sách thanh toán (có thể filter theo customerId, orderId, status...)
router.get('/', PaymentController.getList);

// Lấy thông tin thanh toán theo ID
router.get('/:id', PaymentController.getOne);

// Tạo thanh toán từ giỏ hàng
router.post('/create-from-cart', customerAuthMiddleware, PaymentController.createFromCart);

// Xử lý thanh toán (cập nhật trạng thái)
router.put('/process/:paymentId', PaymentController.processPayment);

// Hoàn tiền
router.put('/refund/:paymentId', PaymentController.refund);

// Lấy thống kê thanh toán
router.get('/statistics/overview', PaymentController.getStatistics);

// check thông tin payment vnpay
router.get('/check-vnpay', PaymentController.checkVnPay);

module.exports = router;
