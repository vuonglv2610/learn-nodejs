const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/customer.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.get('/', CustomerController.getList);

router.get('/:id', CustomerController.getOne);

router.post('/', authMiddleware, CustomerController.create);

router.put('/edit/:id', authMiddleware, CustomerController.edit);

router.delete('/:id', authMiddleware, CustomerController.remove);

module.exports = router;