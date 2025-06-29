const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/payment.controller');
const customerAuthMiddleware = require('../middleware/customer-auth.middleware');

// Lấy danh sách thanh toán (có thể filter theo customerId, orderId, status...)
router.get('/', PaymentController.getList);

// Lấy thông tin thanh toán theo ID
router.get('/:id', PaymentController.getOne);
router.post('/create-from-cart', customerAuthMiddleware, PaymentController.createFromCart);

// check thông tin payment vnpay
router.get('/check-vnpay', PaymentController.checkVnPay);

module.exports = router;
