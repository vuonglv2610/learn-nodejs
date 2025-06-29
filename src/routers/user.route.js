const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { requireAdmin } = require('../middleware/auth.middleware');

router.post('/', UserController.create);

router.get('/' , UserController.getList);

router.get('/:id', UserController.getOne);

router.put('/edit/:id', UserController.edit);

// Chỉ admin mới được xóa user
router.delete('/:id', requireAdmin, UserController.remove);

module.exports = router;


