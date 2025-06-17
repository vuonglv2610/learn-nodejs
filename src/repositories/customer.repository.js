const CustomerModel = require('../models/customer.model');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  get: async (req, res, result) => {
    try {
      // Xây dựng điều kiện query
      const whereCondition = {
        deletedAt: null,
      };
      
      // Tìm kiếm theo tên khách hàng
      if (req.query.name) {
        whereCondition.name = {
          [Op.like]: `%${req.query.name}%`
        };
      }
      
      // Tìm kiếm theo email
      if (req.query.email) {
        whereCondition.email = {
          [Op.like]: `%${req.query.email}%`
        };
      }
      
      // Tìm kiếm theo địa chỉ
      if (req.query.address) {
        whereCondition.address = {
          [Op.like]: `%${req.query.address}%`
        };
      }
      
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
        attributes: { exclude: ['password', 'confirmPassword'] },
        order: order
      };
      
      const customers = await CustomerModel.findAll(queryOptions);
      
      // Trả về tất cả khách hàng
      result(customers);
    } catch (error) {
      console.error('Error executing query:', error);
      result(null);
    }
  },

  getOne: async (req, res, result) => {
    try {
      const customer = await CustomerModel.findOne({
        where: {
          id: req.params.id,
          deletedAt: null,
        },
        attributes: { exclude: ['password', 'confirmPassword'] }
      });
      result(customer);
    } catch (error) {
      console.error('Error executing query:', error);
    }
  },

  create: async (req, res, result) => {
    try {
      const { password, ...customerData } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const customer = await CustomerModel.create({
        id: uuidv4(),
        ...customerData,
        password: hashedPassword,
        confirmPassword: hashedPassword,
        roleId: req.body.roleId || '1', // Default role
      });
      
      const { password: pwd, confirmPassword, ...customerResponse } = customer.toJSON();
      result(customerResponse);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        Response.fail(req, res, 400, 'Email đã tồn tại');
      } else {
        console.error('Error creating customer:', error);
        return Response.fail(req, res, 500, 'Errors');
      }
    }
  },

  edit: async (req, res, result) => {
    const id = req.params.id;
    try {
      const updateData = { ...req.body };
      
      // Nếu có cập nhật mật khẩu
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
        updateData.confirmPassword = updateData.password;
      }
      
      await CustomerModel.update(updateData, {
        where: {
          id,
          deletedAt: null,
        },
      });
      
      const updatedCustomer = await CustomerModel.findByPk(id, {
        attributes: { exclude: ['password', 'confirmPassword'] }
      });
      
      result(updatedCustomer);
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },

  remove: async (req, res, result) => {
    try {
      const customer = await CustomerModel.destroy({
        where: {
          id: req.params.id,
        },
      });
      result(customer);
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  },
};



