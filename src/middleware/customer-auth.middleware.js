const jwt = require('jsonwebtoken');
const Response = require('../helpers/response');
const CustomerModel = require('../models/customer.model');

const customerAuthMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return Response.fail(req, res, 401, 'Unauthorized');
  }

  try {
    const decoded = jwt.verify(token, process.env.KEY_JWT);
    if (!decoded.customerId) {
      return Response.fail(req, res, 401, 'Invalid token type');
    }
    
    const customer = await CustomerModel.findOne({
      where: {
        id: decoded.customerId,
        deletedAt: null,
      }
    });
    
    if (!customer) {
      return Response.fail(req, res, 401, 'Customer not found');
    }
    
    req.customer = customer;
    next();
  } catch (error) {
    return Response.fail(req, res, 400, 'Invalid token.');
  }
};

module.exports = customerAuthMiddleware;