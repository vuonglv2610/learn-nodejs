const express = require('express');
const brandController = require('../controllers/brand.controller');
const router = express.Router();

// Lấy danh sách thương hiệu
router.get('/', brandController.getList);

// Lấy thông tin một thương hiệu theo id
router.get('/:id', brandController.getOne);

// Tạo một thương hiệu mới
router.post('/', brandController.create);

// Cập nhật thông tin thương hiệu
router.put('/:id', brandController.edit);

// Xóa thương hiệu
router.delete('/:id', brandController.remove);

module.exports = router;