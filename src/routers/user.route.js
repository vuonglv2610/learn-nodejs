const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

//user sẽ update profile, đăng ký đăng nhập

router.get('/', UserController.getList);

router.get('/:id', UserController.getOne);

router.post('/', authMiddleware, UserController.create);

router.put('/edit/:id', UserController.edit);

router.delete('/:id', UserController.remove);

module.exports = router;


