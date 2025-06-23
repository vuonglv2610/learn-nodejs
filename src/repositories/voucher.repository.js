const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const VoucherModel = require('../models/voucher.model');
const Response = require('../helpers/response');

module.exports = {
  get: async (req, res, result) => {
    try {
      const vouchers = await VoucherModel.findAll({
        where: {
          deletedAt: null,
        },
        order: [['createdAt', 'DESC']]
      });
      result(vouchers);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      return Response.fail(req, res, 500, 'Lỗi khi lấy danh sách voucher');
    }
  },

  getOne: async (req, res, result) => {
    try {
      const voucher = await VoucherModel.findOne({
        where: {
          id: req.params.id,
          deletedAt: null,
        },
      });
      result(voucher);
    } catch (error) {
      console.error('Error fetching voucher:', error);
      return Response.fail(req, res, 500, 'Lỗi khi lấy thông tin voucher');
    }
  },

  getByCode: async (req, res, result) => {
    try {
      const { code } = req.params;
      const currentDate = new Date();
      
      const voucher = await VoucherModel.findOne({
        where: {
          code,
          deletedAt: null,
          start_date: { [Op.lte]: currentDate },
          end_date: { [Op.gte]: currentDate },
          [Op.or]: [
            { quantity: { [Op.gt]: 0 } },
            { quantity: null }
          ]
        },
      });
      
      result(voucher);
    } catch (error) {
      console.error('Error fetching voucher by code:', error);
      return Response.fail(req, res, 500, 'Lỗi khi kiểm tra voucher');
    }
  },

  create: async (req, res, result) => {
    try {
      const voucher = await VoucherModel.create({
        id: uuidv4(),
        ...req.body,
        used: 0
      });
      result(voucher);
    } catch (error) {
      console.error('Error creating voucher:', error);
      return Response.fail(req, res, 500, 'Lỗi khi tạo voucher');
    }
  },

  edit: async (req, res, result) => {
    try {
      const id = req.params.id;
      await VoucherModel.update(req.body, {
        where: {
          id,
          deletedAt: null,
        },
      });
      const updatedVoucher = await VoucherModel.findByPk(id);
      result(updatedVoucher);
    } catch (error) {
      console.error('Error updating voucher:', error);
      return Response.fail(req, res, 500, 'Lỗi khi cập nhật voucher');
    }
  },

  remove: async (req, res, result) => {
    try {
      const voucher = await VoucherModel.destroy({
        where: {
          id: req.params.id,
        },
      });
      result(voucher);
    } catch (error) {
      console.error('Error deleting voucher:', error);
      return Response.fail(req, res, 500, 'Lỗi khi xóa voucher');
    }
  }
};