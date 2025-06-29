const express = require('express');
const brandController = require('../controllers/brand.controller');
const { authMiddleware, requireAdmin } = require('../middleware/auth.middleware');
const router = express.Router();

// Public routes
router.get('/', brandController.getList);
router.get('/:id', brandController.getOne);

// Protected routes - cần admin
router.post('/', authMiddleware, requireAdmin, brandController.create);
router.put('/:id', authMiddleware, requireAdmin, brandController.edit);
router.delete('/:id', authMiddleware, requireAdmin, brandController.remove);

module.exports = router;