const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

router.get('/', categoryController.getList);

router.get('/:id', categoryController.getOne);

router.post('/', categoryController.create);

router.put('/edit/:id', categoryController.edit);

router.delete('/:id', categoryController.remove);

module.exports = router;

