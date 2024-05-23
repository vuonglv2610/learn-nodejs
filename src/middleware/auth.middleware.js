const jwt = require('jsonwebtoken');
const Response = require('../helpers/response');
const UserModel = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization').split(' ')[1];

  //   todo: check role
  if (!token) {
    return Response.fail(req, res, 401, 'Unauthorized');
  }

  try {
    const decoded = jwt.verify(token, process.env.KEY_JWT);
    const data = await UserModel.findOne({
      where: {
        id: decoded.userId,
        deletedAt: null,
      },
      // todo: add conditions query parameters
    });
    if (data.roleId === 1) {
      return Response.fail(req, res, 401, 'Unauthorized');
    }
    next();
  } catch (error) {
    return Response.fail(req, res, 400, 'Invalid token.');
  }
};

module.exports = authMiddleware;

