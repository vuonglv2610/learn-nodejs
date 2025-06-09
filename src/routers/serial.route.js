const express = require('express');
const serialController = require('../controllers/serial.controller');
const router = express.Router();

// Lấy danh sách tất cả serial
router.get('/', serialController.getList);

// Lấy thông tin một serial theo id
router.get('/:id', serialController.getOne);

// Lấy danh sách serial theo productId
router.get('/product/:productId', serialController.getByProductId);

// Tạo một serial mới
router.post('/', serialController.create);

// Tạo nhiều serial cùng lúc
router.post('/bulk', serialController.bulkCreate);

// Cập nhật thông tin serial
router.put('/:id', serialController.edit);

// Xóa serial
router.delete('/:id', serialController.remove);

module.exports = router;