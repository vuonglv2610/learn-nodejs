const express = require('express');
const commentController = require('../controllers/comment.controller');
const { verifyToken } = require('../middlewares/auth');
const router = express.Router();

// Lấy tất cả đánh giá
router.get('/', commentController.getList);

// Lấy đánh giá theo sản phẩm
router.get('/product/:productId', commentController.getByProduct);

// Lấy đánh giá theo khách hàng
router.get('/customer/:customerId', commentController.getByCustomer);

// Lấy chi tiết một đánh giá
router.get('/:id', commentController.getOne);

// Tạo đánh giá mới (yêu cầu đăng nhập)
router.post('/', verifyToken, commentController.create);

// Cập nhật đánh giá (yêu cầu đăng nhập)
router.put('/:id', verifyToken, commentController.edit);

// Xóa đánh giá (yêu cầu đăng nhập)
router.delete('/:id', verifyToken, commentController.remove);

module.exports = router;