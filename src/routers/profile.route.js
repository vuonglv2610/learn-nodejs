const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/profile.controller');

// Lấy thông tin profile
router.get('/', ProfileController.getProfile);

// Cập nhật thông tin profile
router.put('/', ProfileController.updateProfile);

// Đổi mật khẩu
router.put('/change-password', ProfileController.changePassword);

module.exports = router;