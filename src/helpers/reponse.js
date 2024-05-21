module.exports = {
  success: (req, res, data = null, statusCode = 200) => {
    return res.send({
      statusCode,
      message: 'Success!',
      result: {
        ...(data.length > 1 && { total: data.length }),
        data: data,
      },
    });
  },
  fail: (req, res, statusCode = 500) => {
    res.statusCode = statusCode;
    return res.send({
      statusCode,
      message: 'Failed!',
    });
  },
};

