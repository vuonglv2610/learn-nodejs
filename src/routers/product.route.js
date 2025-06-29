const express = require('express');
const productController = require('../controllers/product.controller');
const { authMiddleware, requireAdmin } = require('../middleware/auth.middleware');
const router = express.Router();

// Public routes - không cần auth
router.get('/', productController.getList);
router.get('/:id', productController.getOne);

// Protected routes - cần auth và admin
router.post('/', authMiddleware, requireAdmin, productController.create);
router.put('/edit/:id', authMiddleware, requireAdmin, productController.edit);
router.delete('/:id', authMiddleware, requireAdmin, productController.remove);

module.exports = router;

