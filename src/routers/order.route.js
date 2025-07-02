const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order.controller');
const response = require('../helpers/response');

// Routes cơ bản (legacy)
router.get('/', OrderController.getList);
router.get('/customer/:customerId', OrderController.getByCustomer);
router.post('/', OrderController.create);
router.put('/:id', OrderController.edit);
router.delete('/:id', OrderController.remove);

// Routes mới với order details
router.get('/with-details', OrderController.getListWithDetails);
router.get('/with-details/:id', OrderController.getWithDetails);
router.post('/with-details', OrderController.createWithDetails);
router.put('/with-details/:id', OrderController.updateWithDetails);
router.delete('/with-details/:id', OrderController.deleteWithDetails);

// Route cũ (để tương thích)
router.get('/:id', OrderController.getOne);

router.get('/dummy', (req, res) => {
    response.success(req, res, 200, 'Lấy data dummy thành công', []);
});

module.exports = router;