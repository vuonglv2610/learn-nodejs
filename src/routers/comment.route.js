const express = require('express');
const commentController = require('../controllers/comment.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const router = express.Router();

// Public routes
router.get('/', commentController.getList);
router.get('/product/:productId', commentController.getByProduct);
router.get('/customer/:customerId', commentController.getByCustomer);
router.get('/:id', commentController.getOne);

// Protected routes - cần đăng nhập (customer hoặc user)
router.post('/', authMiddleware, commentController.create);
router.put('/:id', authMiddleware, commentController.edit);
router.delete('/:id', authMiddleware, commentController.remove);

module.exports = router;