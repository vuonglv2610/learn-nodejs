const Order = require('../models/order.model');
const OrderDetail = require('../models/orderdetail.model');
const Product = require('../models/product.model');
const Customer = require('../models/customer.model');
const Payment = require('../models/payment.model');
const sequelize = require('../models/db');

class OrderService {
  /**
   * Tạo order mới cùng với order details
   * @param {Object} orderData - Dữ liệu order
   * @param {Array} orderItems - Danh sách sản phẩm trong order
   * @param {string} customerId - ID của customer
   */
  async createOrderWithDetails(orderData, orderItems, customerId) {
    const transaction = await sequelize.transaction();

    try {
      // Validate dữ liệu đầu vào
      if (!customerId) {
        throw new Error('Customer ID is required');
      }

      if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
        throw new Error('Order items are required and must be a non-empty array');
      }

      // Kiểm tra customer có tồn tại không
      const customer = await Customer.findByPk(customerId);
      if (!customer) {
        throw new Error(`Customer with ID ${customerId} not found`);
      }

      // Tính tổng tiền từ order items
      let totalAmount = 0;
      const validatedItems = [];

      for (const item of orderItems) {
        if (!item.productId || !item.quantity || !item.unit_price) {
          throw new Error('Each order item must have productId, quantity, and unit_price');
        }

        if (item.quantity <= 0) {
          throw new Error('Quantity must be greater than 0');
        }

        if (item.unit_price < 0) {
          throw new Error('Unit price must be non-negative');
        }

        // Kiểm tra sản phẩm có tồn tại không
        const product = await Product.findByPk(item.productId);
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        const itemTotal = item.quantity * item.unit_price;
        totalAmount += itemTotal;

        validatedItems.push({
          productId: item.productId,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: itemTotal,
          serial_numbers: item.serial_numbers || null
        });
      }

      // Tạo order
      const orderToCreate = {
        customerId: customerId,
        total_amount: totalAmount,
        status: orderData.status || 'pending',
        order_date: orderData.order_date || new Date(),
        ...orderData
      };

      const createdOrder = await Order.create(orderToCreate, { transaction });

      // Tạo order details
      const orderDetailsToCreate = validatedItems.map(item => ({
        ...item,
        orderId: createdOrder.id
      }));

      const createdOrderDetails = await OrderDetail.bulkCreate(orderDetailsToCreate, { transaction });

      // Commit transaction
      await transaction.commit();

      // Lấy thông tin đầy đủ của order đã tạo
      const fullOrder = await this.getOrderWithDetails(createdOrder.id);

      return fullOrder;

    } catch (error) {
      // Rollback transaction nếu có lỗi
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Lấy thông tin order cùng với order details
   * @param {string} orderId - ID của order
   */
  async getOrderWithDetails(orderId) {
    try {
      const order = await Order.findOne({
        where: {
          id: orderId,
          deletedAt: null
        },
        include: [
          {
            model: Customer,
            as: 'customer',
            attributes: ['id', 'name', 'email', 'phone']
          },
          {
            model: OrderDetail,
            as: 'orderDetails',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'sku', 'price', 'img']
              }
            ]
          },
          {
            model: Payment,
            as: 'payment',
            attributes: ['id', 'amount', 'paymentMethod', 'paymentStatus', 'transactionId', 'finalAmount', 'discountAmount'],
            required: false // Left join - order có thể chưa có payment
          }
        ]
      });

      return order;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cập nhật order và order details
   * @param {string} orderId - ID của order
   * @param {Object} orderData - Dữ liệu order cần cập nhật
   * @param {Array} orderItems - Danh sách sản phẩm mới (optional)
   */
  async updateOrderWithDetails(orderId, orderData, orderItems = null) {
    const transaction = await sequelize.transaction();
    
    try {
      // Kiểm tra order có tồn tại không
      const existingOrder = await Order.findByPk(orderId);
      if (!existingOrder) {
        throw new Error('Order not found');
      }

      // Nếu có orderItems mới, cập nhật order details
      if (orderItems && Array.isArray(orderItems)) {
        // Xóa order details cũ
        await OrderDetail.destroy({
          where: { orderId: orderId },
          transaction
        });

        // Tính tổng tiền mới
        let totalAmount = 0;
        const validatedItems = [];

        for (const item of orderItems) {
          if (!item.productId || !item.quantity || !item.unit_price) {
            throw new Error('Each order item must have productId, quantity, and unit_price');
          }

          const itemTotal = item.quantity * item.unit_price;
          totalAmount += itemTotal;

          validatedItems.push({
            orderId: orderId,
            productId: item.productId,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: itemTotal,
            serial_numbers: item.serial_numbers || null
          });
        }

        // Tạo order details mới
        await OrderDetail.bulkCreate(validatedItems, { transaction });

        // Cập nhật total_amount trong order
        orderData.total_amount = totalAmount;
      }

      // Cập nhật order
      await Order.update(orderData, {
        where: { id: orderId },
        transaction
      });

      // Commit transaction
      await transaction.commit();

      // Lấy thông tin đầy đủ của order đã cập nhật
      const updatedOrder = await this.getOrderWithDetails(orderId);

      return updatedOrder;

    } catch (error) {
      // Rollback transaction nếu có lỗi
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Xóa order cùng với order details
   * @param {string} orderId - ID của order
   */
  async deleteOrderWithDetails(orderId) {
    const transaction = await sequelize.transaction();
    
    try {
      // Kiểm tra order có tồn tại không
      const existingOrder = await Order.findByPk(orderId);
      if (!existingOrder) {
        throw new Error('Order not found');
      }

      // Xóa order details trước (soft delete)
      await OrderDetail.destroy({
        where: { orderId: orderId },
        transaction
      });

      // Xóa order (soft delete)
      await Order.destroy({
        where: { id: orderId },
        transaction
      });

      // Commit transaction
      await transaction.commit();

      return { message: 'Order and order details deleted successfully' };

    } catch (error) {
      // Rollback transaction nếu có lỗi
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Lấy danh sách orders với order details
   * @param {Object} filters - Bộ lọc
   */
  async getOrdersWithDetails(filters = {}) {
    try {
      const whereCondition = {
        deletedAt: null,
        ...filters
      };

      const orders = await Order.findAll({
        where: whereCondition,
        include: [
          {
            model: Customer,
            as: 'customer',
            attributes: ['id', 'name', 'email', 'phone']
          },
          {
            model: OrderDetail,
            as: 'orderDetails',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'sku', 'price', 'img']
              }
            ]
          },
          {
            model: Payment,
            as: 'payment',
            attributes: ['id', 'amount', 'paymentMethod', 'paymentStatus', 'transactionId', 'finalAmount', 'discountAmount'],
            required: false // Left join - order có thể chưa có payment
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      return orders;

    } catch (error) {
      throw error;
    }
  }
}

module.exports = new OrderService();
