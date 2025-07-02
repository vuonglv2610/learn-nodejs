const jwt = require('jsonwebtoken');
const Response = require('../helpers/response');
const UserModel = require('../models/user.model');
const CustomerModel = require('../models/customer.model');
const RoleModel = require('../models/role.model');

const authMiddleware = async (req, res, next) => {
  console.log('🔍 Auth middleware called for:', req.method, req.path);
  const authHeader = req.header('Authorization');
  console.log('📝 Auth header:', authHeader ? 'Present' : 'Missing');

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    console.log('❌ Auth header invalid or missing');
    return Response.fail(req, res, 401, 'Unauthorized - Token required');
  }

  const token = authHeader.split(' ')[1];
  console.log('🎫 Token extracted:', token ? 'Present' : 'Missing');

  if (!token) {
    console.log('❌ Token missing after split');
    return Response.fail(req, res, 401, 'Unauthorized - Invalid token format');
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.KEY_JWT);
    console.log('✅ Token decoded successfully:', { userId: decoded.userId, customerId: decoded.customerId });

    let user = null;

    // Kiểm tra xem token chứa userId hay customerId
    if (decoded.userId) {
      user = await UserModel.findOne({
        where: { id: decoded.userId, deletedAt: null },
        include: [{ model: RoleModel, as: 'role' }]
      });
    } else if (decoded.customerId) {
      user = await CustomerModel.findOne({
        where: { id: decoded.customerId, deletedAt: null }
        // Customer không có quan hệ với Role, bỏ include
      });
    }

    if (!user) {
      console.log('❌ User not found in database');
      return Response.fail(req, res, 401, 'User not found');
    }

    console.log('✅ User found:', { id: user.id, email: user.email });
    // Thêm thông tin user và role vào request
    req.user = user;
    req.role = user.role;

    console.log('✅ Auth middleware passed, proceeding to next()');
    next();
  } catch (error) {
    console.log('❌ Token verification failed:', error.name, error.message);
    if (error.name === 'TokenExpiredError') {
      return Response.fail(req, res, 401, 'Token đã hết hạn');
    }
    return Response.fail(req, res, 401, 'Token không hợp lệ');
  }
};

// Middleware kiểm tra admin
const requireAdmin = (req, res, next) => {
  if (!req.role || req.role.role_key !== 'admin') {
    return Response.fail(req, res, 403, 'Cần quyền admin');
  }
  next();
};

module.exports = { authMiddleware, requireAdmin };

