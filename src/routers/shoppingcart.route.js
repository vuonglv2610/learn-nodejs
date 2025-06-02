const express = require('express');
const router = express.Router();
const ShoppingCart = require('../controllers/shoppingcart.controller');

router.get('/', ShoppingCart.getList);

router.get('/:id', ShoppingCart.getOne);

router.get('/customer/:customerId', ShoppingCart.getOneByCustomerId);

router.post('/', ShoppingCart.create);

router.put('/edit/:id', ShoppingCart.edit);

router.delete('/:id', ShoppingCart.remove);

module.exports = router;