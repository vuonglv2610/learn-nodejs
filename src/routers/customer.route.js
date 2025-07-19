const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/customer.controller');
const ProfileController = require('../controllers/profile.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.get('/', CustomerController.getList);
router.get('/:id', CustomerController.getOne);
router.post('/', authMiddleware, CustomerController.create);
router.put('/edit/:id', authMiddleware, CustomerController.edit);
router.delete('/:id', authMiddleware, CustomerController.remove);

// Thêm change-password cho customers
router.put('/change-password', authMiddleware, ProfileController.changePassword);

module.exports = router;