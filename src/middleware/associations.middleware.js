/**
 * Middleware để đảm bảo associations đã được thiết lập
 */

const { isInitialized } = require('../models/init');

const checkAssociations = (req, res, next) => {
  if (!isInitialized()) {
    console.error('❌ Associations chưa được thiết lập khi xử lý request:', req.path);
    return res.status(500).json({
      success: false,
      message: 'Server đang khởi tạo, vui lòng thử lại sau',
      error: 'Database associations not initialized'
    });
  }
  
  next();
};

module.exports = {
  checkAssociations
};
