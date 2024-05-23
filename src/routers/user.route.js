const express = require('express');
const UserController = require('../controllers/user.controller');
const router = express.Router();

//user sẽ update profile, đăng ký đăng nhập

router.get('/', UserController.getList);

router.get('/:id', UserController.getOne);

// router.post('/', UserController.create);

router.put('/edit/:id', UserController.edit);

router.delete('/:id', UserController.remove);

module.exports = router;

