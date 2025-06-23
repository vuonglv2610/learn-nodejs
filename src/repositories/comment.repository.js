const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const CommentModel = require('../models/comments.model');
const CustomerModel = require('../models/customer.model');
const ProductModel = require('../models/product.model');
const Response = require('../helpers/response');

module.exports = {
  get: async (req, res, result) => {
    try {
      // Xây dựng điều kiện query
      const whereCondition = {
        deletedAt: null,
      };
      
      // Xử lý sắp xếp
      const order = [];
      if (req.query.sort_by) {
        order.push([req.query.sort_by, req.query.sort_order || 'ASC']);
      } else {
        order.push(['createdAt', 'DESC']);
      }
      
      // Chuẩn bị options cho query
      const queryOptions = {
        where: whereCondition,
        order: order,
        include: [
          {
            model: CustomerModel,
            as: 'customer',
            attributes: ['id', 'name', 'email', 'avatar']
          },
          {
            model: ProductModel,
            as: 'product',
            attributes: ['id', 'name', 'img']
          }
        ]
      };
      
      const comments = await CommentModel.findAll(queryOptions);
      result(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      result(null);
    }
  },

  getByProduct: async (req, res, result) => {
    try {
      const productId = req.params.productId;
      
      const comments = await CommentModel.findAll({
        where: {
          productId,
          deletedAt: null,
        },
        include: [
          {
            model: CustomerModel,
            as: 'customer',
            attributes: ['id', 'name', 'email', 'avatar']
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      
      result(comments);
    } catch (error) {
      console.error('Error fetching product comments:', error);
      result(null);
    }
  },

  getByCustomer: async (req, res, result) => {
    try {
      const customerId = req.params.customerId;
      
      const comments = await CommentModel.findAll({
        where: {
          customerId,
          deletedAt: null,
        },
        include: [
          {
            model: ProductModel,
            as: 'product',
            attributes: ['id', 'name', 'img', 'price']
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      
      result(comments);
    } catch (error) {
      console.error('Error fetching customer comments:', error);
      result(null);
    }
  },

  getOne: async (req, res, result) => {
    try {
      const comment = await CommentModel.findOne({
        where: {
          id: req.params.id,
          deletedAt: null,
        },
        include: [
          {
            model: CustomerModel,
            as: 'customer',
            attributes: ['id', 'name', 'email', 'avatar']
          },
          {
            model: ProductModel,
            as: 'product',
            attributes: ['id', 'name', 'img']
          }
        ]
      });
      result(comment);
    } catch (error) {
      console.error('Error fetching comment:', error);
      result(null);
    }
  },

  create: async (req, res, result) => {
    try {
      // Kiểm tra xem sản phẩm có tồn tại không
      const product = await ProductModel.findByPk(req.body.productId);
      if (!product) {
        return Response.fail(req, res, 404, 'Sản phẩm không tồn tại');
      }
      
      // Kiểm tra xem khách hàng có tồn tại không
      const customer = await CustomerModel.findByPk(req.body.customerId);
      if (!customer) {
        return Response.fail(req, res, 404, 'Khách hàng không tồn tại');
      }
      
      // Tạo comment mới
      const comment = await CommentModel.create({
        id: uuidv4(),
        ...req.body
      });
      
      // Lấy comment với thông tin khách hàng và sản phẩm
      const newComment = await CommentModel.findOne({
        where: { id: comment.id },
        include: [
          {
            model: CustomerModel,
            as: 'customer',
            attributes: ['id', 'name', 'email', 'avatar']
          },
          {
            model: ProductModel,
            as: 'product',
            attributes: ['id', 'name', 'img']
          }
        ]
      });
      
      result(newComment);
    } catch (error) {
      console.error('Error creating comment:', error);
      return Response.fail(req, res, 500, 'Lỗi khi tạo đánh giá');
    }
  },

  edit: async (req, res, result) => {
    try {
      const id = req.params.id;
      
      // Kiểm tra xem comment có tồn tại không
      const existingComment = await CommentModel.findOne({
        where: {
          id,
          deletedAt: null
        }
      });
      
      if (!existingComment) {
        return Response.fail(req, res, 404, 'Đánh giá không tồn tại');
      }
      
      // Kiểm tra quyền chỉnh sửa (chỉ cho phép chủ sở hữu comment)
      if (existingComment.customerId !== req.customer.id) {
        return Response.fail(req, res, 403, 'Bạn không có quyền chỉnh sửa đánh giá này');
      }
      
      // Cập nhật comment
      await CommentModel.update(req.body, {
        where: {
          id,
          deletedAt: null,
        },
      });
      
      // Lấy comment đã cập nhật
      const updatedComment = await CommentModel.findOne({
        where: { id },
        include: [
          {
            model: CustomerModel,
            as: 'customer',
            attributes: ['id', 'name', 'email', 'avatar']
          },
          {
            model: ProductModel,
            as: 'product',
            attributes: ['id', 'name', 'img']
          }
        ]
      });
      
      result(updatedComment);
    } catch (error) {
      console.error('Error updating comment:', error);
      return Response.fail(req, res, 500, 'Lỗi khi cập nhật đánh giá');
    }
  },

  remove: async (req, res, result) => {
    try {
      const id = req.params.id;
      
      // Kiểm tra xem comment có tồn tại không
      const existingComment = await CommentModel.findOne({
        where: {
          id,
          deletedAt: null
        }
      });
      
      if (!existingComment) {
        return result(null);
      }
      
      // Kiểm tra quyền xóa (chỉ cho phép chủ sở hữu comment)
      if (existingComment.customerId !== req.customer.id) {
        return Response.fail(req, res, 403, 'Bạn không có quyền xóa đánh giá này');
      }
      
      // Xóa comment (soft delete)
      const comment = await CommentModel.destroy({
        where: {
          id: req.params.id,
        },
      });
      
      result(comment);
    } catch (error) {
      console.error('Error deleting comment:', error);
      return Response.fail(req, res, 500, 'Lỗi khi xóa đánh giá');
    }
  }
};