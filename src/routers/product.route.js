const express = require('express');
const productController = require('../controllers/product.controller');
const router = express.Router();

router.get('/', productController.getList);

router.get('/:id', productController.getOne);

router.post('/', productController.create);

router.put('/edit/:id', productController.edit);

router.delete('/:id', productController.remove);

module.exports = router;

