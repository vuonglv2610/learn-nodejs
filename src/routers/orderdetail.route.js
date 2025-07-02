const express = require('express');
const router = express.Router();
const orderDetailController = require('../controllers/orderdetail.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// Routes cho Order Details

// GET /api/order-details - Lấy danh sách order details (có thể filter theo orderId, productId)
router.get('/', authMiddleware, orderDetailController.getOrderDetails);

// GET /api/order-details/:id - Lấy order detail theo ID
router.get('/:id', authMiddleware, orderDetailController.getOrderDetailById);

// GET /api/order-details/order/:orderId - Lấy tất cả order details của một order
router.get('/order/:orderId', authMiddleware, orderDetailController.getOrderDetailsByOrderId);

// POST /api/order-details - Tạo order detail mới
router.post('/', authMiddleware, orderDetailController.createOrderDetail);

// POST /api/order-details/bulk - Tạo nhiều order details cùng lúc
router.post('/bulk', authMiddleware, orderDetailController.createBulkOrderDetails);

// PUT /api/order-details/:id - Cập nhật order detail
router.put('/:id', authMiddleware, orderDetailController.updateOrderDetail);

// DELETE /api/order-details/:id - Xóa order detail
router.delete('/:id', authMiddleware, orderDetailController.deleteOrderDetail);

module.exports = router;
