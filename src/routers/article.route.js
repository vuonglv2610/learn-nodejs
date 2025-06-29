const express = require('express');
const articleController = require('../controllers/article.controller');
const { authMiddleware, requireAdmin } = require('../middleware/auth.middleware');
const router = express.Router();

// Public route - đọc bài viết
router.get('/:id', articleController.getOne);
router.get('/', requireAdmin, articleController.getList);

// Protected routes - cần auth
router.post('/', authMiddleware, requireAdmin, articleController.create);
router.put('/:id', authMiddleware, requireAdmin, articleController.edit);
router.delete('/:id', authMiddleware, requireAdmin, articleController.remove);

module.exports = router;
