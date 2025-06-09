const CustomerModel = require('../models/customer.model');
const Response = require('../helpers/response');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

module.exports = {
  get: async (req, res, result) => {
    try {
      const customers = await CustomerModel.findAll({
        where: {
          deletedAt: null,
        },
        attributes: { exclude: ['password', 'confirmPassword'] }
      });
      result(customers);
    } catch (error) {
      console.error('Error executing query:', error);
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


