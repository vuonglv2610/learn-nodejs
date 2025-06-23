const express = require('express');
const voucherController = require('../controllers/voucher.controller');
const router = express.Router();

// Lấy danh sách voucher
router.get('/', voucherController.getList);

// Lấy thông tin một voucher theo id
router.get('/:id', voucherController.getOne);

// Kiểm tra voucher theo mã
router.get('/code/:code', voucherController.getByCode);

// Tạo một voucher mới
router.post('/', voucherController.create);

// Cập nhật thông tin voucher
router.put('/:id', voucherController.edit);

// Xóa voucher
router.delete('/:id', voucherController.remove);

module.exports = router;