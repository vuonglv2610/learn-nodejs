const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/payment.controller');
const { authMiddleware, requireAdmin } = require('../middleware/auth.middleware');

// Public routes - có thể không cần auth
router.get('/check-payment', PaymentController.checkVnPay); // VNPay callback có thể cần public

// Customer routes - cần đăng nhập
router.post('/create-from-cart', authMiddleware, PaymentController.createFromCart);
router.get('/:id', authMiddleware, PaymentController.getOne); // Customer xem payment của mình

// Admin routes - chỉ admin
router.get('/', authMiddleware, requireAdmin, PaymentController.getList); // Admin xem tất cả payments

module.exports = router;
