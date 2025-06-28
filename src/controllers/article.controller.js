const Response = require('../helpers/response');
const ArticleRepository = require('../repositories/article.repository');

module.exports = {
  getList: (req, res) => {
    ArticleRepository.get(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res, 500, 'Lỗi khi lấy danh sách bài viết');
      }
      return Response.success(req, res, result);
    });
  },

  getOne: (req, res) => {
    ArticleRepository.getOne(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res, 404, 'Bài viết không tồn tại');
      }
      return Response.success(req, res, result);
    });
  },

  create: (req, res) => {
    ArticleRepository.create(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res, 500, 'Lỗi khi tạo bài viết');
      }
      return Response.success(req, res, result);
    });
  },

  edit: (req, res) => {
    ArticleRepository.edit(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res, 500, 'Lỗi khi cập nhật bài viết');
      }
      return Response.success(req, res, result);
    });
  },

  remove: (req, res) => {
    ArticleRepository.remove(req, res, (result) => {
      if (!result) {
        return Response.fail(req, res, 404, 'Bài viết không tồn tại');
      }
      return Response.success(req, res, { message: 'Xóa bài viết thành công' });
    });
  },
};
