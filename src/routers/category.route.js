const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authMiddleware, requireAdmin } = require('../middleware/auth.middleware');

// Public routes
router.get('/', categoryController.getList);
router.get('/:id', categoryController.getOne);

// Protected routes - cần admin
router.post('/', authMiddleware, requireAdmin, categoryController.create);
router.put('/edit/:id', authMiddleware, requireAdmin, categoryController.edit);
router.delete('/:id', authMiddleware, requireAdmin, categoryController.remove);

module.exports = router;

