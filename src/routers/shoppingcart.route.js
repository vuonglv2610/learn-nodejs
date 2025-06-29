const express = require('express');
const router = express.Router();
const ShoppingCart = require('../controllers/shoppingcart.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// Tất cả shopping cart operations cần auth
router.get('/', authMiddleware, ShoppingCart.getList);
router.get('/:id', authMiddleware, ShoppingCart.getOne);
router.get('/customer/:customerId', authMiddleware, ShoppingCart.getOneByCustomerId);
router.post('/', authMiddleware, ShoppingCart.create);
router.put('/edit/:id', authMiddleware, ShoppingCart.edit);
router.delete('/:id', authMiddleware, ShoppingCart.remove);

module.exports = router;