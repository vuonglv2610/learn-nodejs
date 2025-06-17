module.exports = {
  success: (req, res, data = null, statusCode = 200, token = null) => {
    return res.send({
      statusCode,
      message: 'Success!',
      result: {
        ...(token && { token: token }),
        data: data,
      },
    });
  },
  fail: (req, res, statusCode = 500, message = '') => {
    // todo: trả về 1 mảng lỗi nếu có
    res.statusCode = statusCode;
    return res.send({
      statusCode,
      message: message || 'Failed!',
    });
  },
};

