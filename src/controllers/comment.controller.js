const Response = require('../helpers/response');
const CommentRepository = require('../repositories/comment.repository');

module.exports = {
  getList: (req, res) => {
    CommentRepository.get(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res);
      }
      return Response.success(req, res, result);
    });
  },

  getByProduct: (req, res) => {
    CommentRepository.getByProduct(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res);
      }
      return Response.success(req, res, result);
    });
  },

  getByCustomer: (req, res) => {
    CommentRepository.getByCustomer(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res);
      }
      return Response.success(req, res, result);
    });
  },

  getOne: (req, res) => {
    CommentRepository.getOne(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res, 404, 'Đánh giá không tồn tại');
      }
      return Response.success(req, res, result);
    });
  },

  create: (req, res) => {
    // Lấy thông tin khách hàng từ token đã được xác thực
    const customerId = req.customer.id;
    
    // Thêm customerId vào body request
    req.body.customerId = customerId;
    
    CommentRepository.create(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res);
      }
      return Response.success(req, res, result);
    });
  },

  edit: (req, res) => {
    // Lấy thông tin khách hàng từ token đã được xác thực
    const customerId = req.customer.id;
    
    // Thêm customerId vào request để repository có thể kiểm tra quyền
    req.customerId = customerId;
    
    CommentRepository.edit(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res);
      }
      return Response.success(req, res, result);
    });
  },

  remove: (req, res) => {
    // Lấy thông tin khách hàng từ token đã được xác thực
    const customerId = req.customer.id;
    
    // Thêm customerId vào request để repository có thể kiểm tra quyền
    req.customerId = customerId;
    
    CommentRepository.remove(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res, 404, 'Đánh giá không tồn tại');
      }
      return Response.success(req, res, { message: 'Xóa đánh giá thành công' });
    });
  }
};