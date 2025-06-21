const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order.controller');
const response = require('../helpers/response');

router.get('/', OrderController.getList);
router.get('/:id', OrderController.getOne);
router.post('/', OrderController.create);
router.put('/:id', OrderController.edit);
router.delete('/:id', OrderController.remove);
router.get('/dummy', (req, res) => {
    response.success(req, res, 200, 'Lấy data dummy thành công', []);
});

module.exports = router;