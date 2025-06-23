const { v4: uuidv4 } = require('uuid');
const BrandModel = require('../models/brand.model');
const Response = require('../helpers/response');

module.exports = {
  get: async (req, res, result) => {
    try {
      const brands = await BrandModel.findAll({
        where: {
          deletedAt: null,
        },
        order: [['createdAt', 'DESC']]
      });
      result(brands);
    } catch (error) {
      console.error('Error fetching brands:', error);
      return Response.fail(req, res, 500, 'Lỗi khi lấy danh sách thương hiệu');
    }
  },

  getOne: async (req, res, result) => {
    try {
      const brand = await BrandModel.findOne({
        where: {
          id: req.params.id,
          deletedAt: null,
        },
      });
      result(brand);
    } catch (error) {
      console.error('Error fetching brand:', error);
      return Response.fail(req, res, 500, 'Lỗi khi lấy thông tin thương hiệu');
    }
  },

  create: async (req, res, result) => {
    try {
      const brand = await BrandModel.create({
        id: uuidv4(),
        ...req.body
      });
      result(brand);
    } catch (error) {
      console.error('Error creating brand:', error);
      return Response.fail(req, res, 500, 'Lỗi khi tạo thương hiệu');
    }
  },

  edit: async (req, res, result) => {
    try {
      const id = req.params.id;
      await BrandModel.update(req.body, {
        where: {
          id,
          deletedAt: null,
        },
      });
      const updatedBrand = await BrandModel.findByPk(id);
      result(updatedBrand);
    } catch (error) {
      console.error('Error updating brand:', error);
      return Response.fail(req, res, 500, 'Lỗi khi cập nhật thương hiệu');
    }
  },

  remove: async (req, res, result) => {
    try {
      const brand = await BrandModel.destroy({
        where: {
          id: req.params.id,
        },
      });
      result(brand);
    } catch (error) {
      console.error('Error deleting brand:', error);
      return Response.fail(req, res, 500, 'Lỗi khi xóa thương hiệu');
    }
  }
};