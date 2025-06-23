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
    CommentRepository.create(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res);
      }
      return Response.success(req, res, result);
    });
  },

  edit: (req, res) => {
    CommentRepository.edit(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res);
      }
      return Response.success(req, res, result);
    });
  },

  remove: (req, res) => {
    CommentRepository.remove(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res, 404, 'Đánh giá không tồn tại');
      }
      return Response.success(req, res, { message: 'Xóa đánh giá thành công' });
    });
  }
};