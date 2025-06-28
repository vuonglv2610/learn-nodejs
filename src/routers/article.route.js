const express = require('express');
const articleController = require('../controllers/article.controller');
const router = express.Router();

// API admin - Lấy danh sách tất cả bài viết (cần auth)
router.get('/', articleController.getList);

// Lấy thông tin một bài viết theo id
router.get('/:id', articleController.getOne);

// Tạo một bài viết mới (cần auth)
router.post('/', articleController.create);

// Cập nhật thông tin bài viết (cần auth)
router.put('/:id', articleController.edit);

// Xóa bài viết (cần auth)
router.delete('/:id', articleController.remove);

module.exports = router;
