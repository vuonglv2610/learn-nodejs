const ArticleModel = require('../models/article.model');
const UserModel = require('../models/user.model');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const Response = require('../helpers/response');

module.exports = {
  get: async (req, res, result) => {
    try {
      // Xây dựng điều kiện query
      const whereCondition = {
        deletedAt: null,
      };
      
      // Tìm kiếm theo tiêu đề
      if (req.query.title) {
        whereCondition.title = {
          [Op.like]: `%${req.query.title}%`
        };
      }
      
      // Tìm kiếm theo trạng thái
      if (req.query.status) {
        whereCondition.status = req.query.status;
      }
      
      // Xử lý sắp xếp
      const order = [];
      if (req.query.sort_by) {
        order.push([req.query.sort_by, req.query.sort_order || 'ASC']);
      } else {
        order.push(['createdAt', 'DESC']);
      }
      
      // Phân trang
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      
      // Chuẩn bị options cho query
      const queryOptions = {
        where: whereCondition,
        include: [
          {
            model: UserModel,
            as: 'author',
            attributes: ['id', 'name', 'email']
          }
        ],
        order: order,
        limit: limit,
        offset: offset
      };
      
      const { count, rows: articles } = await ArticleModel.findAndCountAll(queryOptions);
      
      // Trả về kết quả với thông tin phân trang
      result({
        articles,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: limit
        }
      });
    } catch (error) {
      console.error('Error fetching articles:', error);
      result(null);
    }
  },

  getOne: async (req, res, result) => {
    try {
      const article = await ArticleModel.findOne({
        where: {
          id: req.params.id,
          deletedAt: null,
        },
        include: [
          {
            model: UserModel,
            as: 'author',
            attributes: ['id', 'name', 'email']
          }
        ]
      });
      
      // Tăng view count nếu tìm thấy bài viết
      if (article) {
        await ArticleModel.increment('view', {
          where: { id: req.params.id }
        });
        
        // Lấy lại bài viết với view count đã cập nhật
        const updatedArticle = await ArticleModel.findByPk(req.params.id);
        result(updatedArticle);
      } else {
        result(null);
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      result(null);
    }
  },

  create: async (req, res, result) => {
    try {
      // Validation dữ liệu đầu vào
      if (!req.body.title) {
        return Response.fail(req, res, 400, 'Tiêu đề là bắt buộc');
      }

      if (!req.body.content) {
        return Response.fail(req, res, 400, 'Nội dung là bắt buộc');
      }

      if (!req.body.userId) {
        return Response.fail(req, res, 400, 'UserId là bắt buộc');
      }

      // Kiểm tra user có tồn tại không
      const user = await UserModel.findByPk(req.body.userId);
      if (!user) {
        return Response.fail(req, res, 404, 'User không tồn tại');
      }

      // Tự động set publicAt nếu status là published
      const articleData = {
        id: uuidv4(),
        ...req.body
      };

      if (req.body.status === 'published' && !req.body.publicAt) {
        articleData.publicAt = new Date();
      }

      const article = await ArticleModel.create(articleData);
      result(article);
    } catch (error) {
      console.error('Error creating article:', error);
      return Response.fail(req, res, 500, 'Lỗi khi tạo bài viết');
    }
  },

  edit: async (req, res, result) => {
    try {
      const id = req.params.id;
      
      // Kiểm tra bài viết có tồn tại không
      const existingArticle = await ArticleModel.findOne({
        where: {
          id,
          deletedAt: null
        }
      });
      
      if (!existingArticle) {
        return Response.fail(req, res, 404, 'Bài viết không tồn tại');
      }

      const updateData = { ...req.body };

      // Tự động set publicAt nếu chuyển status thành published
      if (req.body.status === 'published' && existingArticle.status !== 'published' && !req.body.publicAt) {
        updateData.publicAt = new Date();
      }

      await ArticleModel.update(updateData, {
        where: {
          id,
          deletedAt: null,
        },
      });
      
      const updatedArticle = await ArticleModel.findByPk(id);
      result(updatedArticle);
    } catch (error) {
      console.error('Error updating article:', error);
      return Response.fail(req, res, 500, 'Lỗi khi cập nhật bài viết');
    }
  },

  remove: async (req, res, result) => {
    try {
      const article = await ArticleModel.destroy({
        where: {
          id: req.params.id,
        },
      });
      result(article);
    } catch (error) {
      console.error('Error deleting article:', error);
      return Response.fail(req, res, 500, 'Lỗi khi xóa bài viết');
    }
  },
};
