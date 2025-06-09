const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/customer.controller');
const customerAuthMiddleware = require('../middleware/customer-auth.middleware');

router.get('/', CustomerController.getList);

router.get('/:id', CustomerController.getOne);

router.post('/', CustomerController.create);

router.put('/edit/:id', customerAuthMiddleware, CustomerController.edit);

router.delete('/:id', customerAuthMiddleware, CustomerController.remove);

module.exports = router;