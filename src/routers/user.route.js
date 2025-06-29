const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { authMiddleware, requireAdmin } = require('../middleware/auth.middleware');

//user sẽ update profile, đăng ký đăng nhập

// Public route - không cần auth (có thể để public để register)
router.post('/', UserController.create);

// Protected routes - cần authentication và authorization
router.get('/', authMiddleware, UserController.getList);

router.get('/:id', authMiddleware, UserController.getOne);

router.put('/edit/:id', authMiddleware, UserController.edit);

// Chỉ admin mới được xóa user
router.delete('/:id', authMiddleware, requireAdmin, UserController.remove);

module.exports = router;


