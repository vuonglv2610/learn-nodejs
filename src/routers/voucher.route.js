const express = require('express');
const voucherController = require('../controllers/voucher.controller');
const { authMiddleware, requireAdmin } = require('../middleware/auth.middleware');
const router = express.Router();

// Public routes - customer có thể xem và check voucher
router.get('/', voucherController.getList);
router.get('/:id', voucherController.getOne);
router.get('/code/:code', voucherController.getByCode);

// Protected routes - chỉ admin quản lý voucher
router.post('/', authMiddleware, requireAdmin, voucherController.create);
router.put('/:id', authMiddleware, requireAdmin, voucherController.edit);
router.delete('/:id', authMiddleware, requireAdmin, voucherController.remove);

module.exports = router;