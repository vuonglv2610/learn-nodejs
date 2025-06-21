const Order = require('../models/order.model');
const Customer = require('../models/customer.model');
const { Op } = require('sequelize');

module.exports = {
  get: async (req, res, result) => {
    try {
      // Xây dựng điều kiện query
      const whereCondition = {
        deletedAt: null,
      };
      
      // Tìm kiếm theo customerId
      if (req.query.customer_id) {
        whereCondition.customer_id = req.query.customer_id;
      }
      
      // Tìm kiếm theo status
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
      
      // Chuẩn bị options cho query
      const queryOptions = {
        where: whereCondition,
        include: [
          {
            model: Customer,
            as: 'customer',
            attributes: ['id', 'name', 'email', 'phone']
          }
        ],
        order: order
      };
      
      const orders = await Order.findAll(queryOptions);
      result(orders);
    } catch (error) {
      console.error('Error executing query:', error);
      result(null);
    }
  },

  getById: async (req, res, result) => {
    try {
      const order = await Order.findByPk(req.params.id, {
        include: [
          {
            model: Customer,
            as: 'customer',
            attributes: ['id', 'name', 'email', 'phone']
          }
        ]
      });
      
      if (!order) {
        return result(null);
      }
      
      result(order);
    } catch (error) {
      console.error('Error executing query:', error);
      result(null);
    }
  },

  create: async (req, res, result) => {
    try {
      const order = await Order.create(req.body);
      result(order);
    } catch (error) {
      console.error('Error creating order:', error);
      result(null);
    }
  },

  update: async (req, res, result) => {
    try {
      const order = await Order.findByPk(req.params.id);
      
      if (!order) {
        return result(null);
      }
      
      await order.update(req.body);
      result(order);
    } catch (error) {
      console.error('Error updating order:', error);
      result(null);
    }
  },

  delete: async (req, res, result) => {
    try {
      const order = await Order.findByPk(req.params.id);
      
      if (!order) {
        return result(null);
      }
      
      await order.destroy();
      result(order);
    } catch (error) {
      console.error('Error deleting order:', error);
      result(null);
    }
  }
};