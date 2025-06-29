const jwt = require('jsonwebtoken');
const Response = require('../helpers/response');
const UserModel = require('../models/user.model');
const CustomerModel = require('../models/customer.model');
const RoleModel = require('../models/role.model');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return Response.fail(req, res, 401, 'Unauthorized - Token required');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return Response.fail(req, res, 401, 'Unauthorized - Invalid token format');
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.KEY_JWT);

    let user = null;

    // Kiểm tra xem token chứa userId hay customerId
    if (decoded.userId) {
      user = await UserModel.findOne({
        where: { id: decoded.userId, deletedAt: null },
        include: [{ model: RoleModel, as: 'role' }]
      });
    } else if (decoded.customerId) {
      user = await CustomerModel.findOne({
        where: { id: decoded.customerId, deletedAt: null },
        include: [{ model: RoleModel, as: 'role' }]
      });
    }

    if (!user) {
      return Response.fail(req, res, 401, 'User not found');
    }

    // Thêm thông tin user và role vào request
    req.user = user;
    req.role = user.role;

    next();
  } catch (error) {
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

