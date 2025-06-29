const express = require('express');
const serialController = require('../controllers/serial.controller');
const { authMiddleware, requireAdmin } = require('../middleware/auth.middleware');
const router = express.Router();

// Protected routes - tất cả serial operations cần admin
router.get('/', authMiddleware, requireAdmin, serialController.getList);
router.get('/:id', authMiddleware, requireAdmin, serialController.getOne);
router.get('/product/:productId', authMiddleware, requireAdmin, serialController.getByProductId);
router.post('/', authMiddleware, requireAdmin, serialController.create);
router.post('/bulk', authMiddleware, requireAdmin, serialController.bulkCreate);
router.put('/:id', authMiddleware, requireAdmin, serialController.edit);
router.delete('/:id', authMiddleware, requireAdmin, serialController.remove);

module.exports = router;