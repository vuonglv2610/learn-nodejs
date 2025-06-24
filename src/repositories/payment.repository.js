const { v4: uuidv4 } = require('uuid');
const PaymentModel = require('../models/payment.model');
const OrderModel = require('../models/order.model');
const CustomerModel = require('../models/customer.model');
const VoucherModel = require('../models/voucher.model');
const ShoppingCartModel = require('../models/shoppingcart.model');
const ProductModel = require('../models/product.model');
const SerialModel = require('../models/serial.model');
const { Op, Sequelize } = require('sequelize');
const sequelize = require('../models/db');
const { VNPay, ignoreLogger, VnpLocale } = require('vnpay');
require('dotenv').config();

module.exports = {
  // Lấy danh sách thanh toán
  get: async (req, res, result) => {
    try {
      const whereCondition = {
        deletedAt: null,
      };
      
      // Tìm kiếm theo customerId
      if (req.query.customerId) {
        whereCondition.customerId = req.query.customerId;
      }
      
      // Tìm kiếm theo orderId
      if (req.query.orderId) {
        whereCondition.orderId = req.query.orderId;
      }
      
      // Tìm kiếm theo trạng thái thanh toán
      if (req.query.paymentStatus) {
        whereCondition.paymentStatus = req.query.paymentStatus;
      }
      
      // Tìm kiếm theo phương thức thanh toán
      if (req.query.paymentMethod) {
        whereCondition.paymentMethod = req.query.paymentMethod;
      }
      
      // Xử lý sắp xếp
      const order = [];
      if (req.query.sort_by) {
        order.push([req.query.sort_by, req.query.sort_order || 'ASC']);
      } else {
        order.push(['createdAt', 'DESC']);
      }
      
      const payments = await PaymentModel.findAll({
        where: whereCondition,
        include: [
          {
            model: OrderModel,
            as: 'order',
            attributes: ['id', 'order_date', 'status', 'total_amount']
          },
          {
            model: CustomerModel,
            as: 'customer',
            attributes: ['id', 'name', 'email', 'phone']
          },
          {
            model: VoucherModel,
            as: 'voucher',
            attributes: ['id', 'code', 'discount_type', 'discount_value'],
            required: false
          }
        ],
        order: order
      });
      
      result(payments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      result(null);
    }
  },

  // Lấy thông tin thanh toán theo ID
  getOne: async (req, res, result) => {
    try {
      const payment = await PaymentModel.findOne({
        where: {
          id: req.params.id,
          deletedAt: null,
        },
        include: [
          {
            model: OrderModel,
            as: 'order',
            attributes: ['id', 'order_date', 'status', 'total_amount']
          },
          {
            model: CustomerModel,
            as: 'customer',
            attributes: ['id', 'name', 'email', 'phone']
          },
          {
            model: VoucherModel,
            as: 'voucher',
            attributes: ['id', 'code', 'discount_type', 'discount_value'],
            required: false
          }
        ]
      });
      
      result(payment);
    } catch (error) {
      console.error('Error fetching payment:', error);
      result(null);
    }
  },

  // Tạo thanh toán từ giỏ hàng
  createFromCart: async (req, res, result) => {
    const transaction = await sequelize.transaction();
    
    try {
      const { customerId, paymentMethod, voucherId, description } = req.body;
      
      // 1. Lấy tất cả sản phẩm trong giỏ hàng
      const cartItems = await ShoppingCartModel.findAll({
        where: {
          customer_id: customerId,
          deletedAt: null
        },
        include: [
          {
            model: ProductModel,
            as: 'product',
            attributes: ['id', 'name', 'price', 'sku']
          }
        ],
        transaction
      });
      
      if (!cartItems || cartItems.length === 0) {
        await transaction.rollback();
        return result({ error: 'Giỏ hàng trống' });
      }
      
      // 2. Tính tổng tiền
      let totalAmount = 0;
      for (const item of cartItems) {
        totalAmount += item.product.price * item.quantity;
      }
      
      // 3. Áp dụng voucher nếu có
      let discountAmount = 0;
      let voucher = null;
      
      if (voucherId) {
        voucher = await VoucherModel.findOne({
          where: {
            id: voucherId,
            deletedAt: null,
            isActive: true,
            validFrom: { [Op.lte]: new Date() },
            validTo: { [Op.gte]: new Date() },
            used: { [Op.lt]: Sequelize.col('usageLimit') }
          },
          transaction
        });
        
        if (voucher) {
          if (voucher.discount_type === 'percentage') {
            discountAmount = (totalAmount * voucher.discount_value) / 100;
            if (voucher.maxDiscount && discountAmount > voucher.maxDiscount) {
              discountAmount = voucher.maxDiscount;
            }
          } else if (voucher.discount_type === 'fixed') {
            discountAmount = voucher.discount_value;
          }
          
          // Cập nhật số lần sử dụng voucher
          await VoucherModel.update(
            { used: voucher.used + 1 },
            { where: { id: voucherId }, transaction }
          );
        }
      }
      
      const finalAmount = totalAmount - discountAmount;
      
      // 4. Tạo đơn hàng
      const order = await OrderModel.create({
        id: uuidv4(),
        customerId: customerId,
        order_date: new Date(),
        status: 'pending',
        total_amount: finalAmount
      }, { transaction });
      
      // 5. Tạo thanh toán
      const payment = await PaymentModel.create({
        id: uuidv4(),
        orderId: order.id,
        customerId: customerId,
        amount: totalAmount,
        paymentMethod: paymentMethod,
        paymentStatus: 'pending',
        transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        description: description,
        voucherId: voucherId,
        discountAmount: discountAmount,
        finalAmount: finalAmount
      }, { transaction });
      
      // 6. Xóa giỏ hàng sau khi tạo đơn hàng thành công
      await ShoppingCartModel.destroy({
        where: {
          customer_id: customerId
        },
        transaction
      });
      
      await transaction.commit();
      
      // Lấy thông tin thanh toán đã tạo kèm thông tin liên quan
      const createdPayment = await PaymentModel.findOne({
        where: { id: payment.id },
        include: [
          {
            model: OrderModel,
            as: 'order',
            attributes: ['id', 'order_date', 'status', 'total_amount']
          },
          {
            model: CustomerModel,
            as: 'customer',
            attributes: ['id', 'name', 'email', 'phone']
          },
          {
            model: VoucherModel,
            as: 'voucher',
            attributes: ['id', 'code', 'discount_type', 'discount_value'],
            required: false
          }
        ]
      });

      const vnpay = new VNPay({
        tmnCode: process.env.VNPAY_TMN_CODE,
        secureSecret: process.env.VNPAY_SECRET_KEY,
        vnpayHost: process.env.VNPAY_HOST,
        testMode: true,
        loggerFn:ignoreLogger,
      })
      const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      const vnpayResponse = await vnpay.buildPaymentUrl({
        vnp_Amount: createdPayment.finalAmount * 100,
        vnp_IpAddr: ipAddr,
        vnp_ReturnUrl: process.env.VNPAY_RETURN_URL,
        vnp_TxnRef: payment.id,
        vnp_OrderInfo: `${payment.id}`,
        vnp_Locale: VnpLocale.VN,
        vnp_CreateDate: new Date().toISOString(),
        vnp_ExpireDate: new Date(Date.now() + 20 * 60 * 1000).toISOString(), // 20 phút sau khi tạo
      })
      console.log("vnpayResponse: ", vnpayResponse)
      // TODO: sửa để tra về vnpREsponse cho client (link đến trang thanh toán)
      result(createdPayment);
    } catch (error) {
      await transaction.rollback();
      console.error('Error creating payment from cart:', error);
      result(null);
    }
  },

  // Xử lý thanh toán
  processPayment: async (req, res, result) => {
    const transaction = await sequelize.transaction();
    
    try {
      const { paymentId } = req.params;
      const { paymentStatus, paymentGatewayResponse } = req.body;
      
      const payment = await PaymentModel.findOne({
        where: {
          id: paymentId,
          deletedAt: null
        },
        transaction
      });
      
      if (!payment) {
        await transaction.rollback();
        return result({ error: 'Không tìm thấy thanh toán' });
      }
      
      // Cập nhật trạng thái thanh toán
      const updateData = {
        paymentStatus: paymentStatus,
        paymentGatewayResponse: paymentGatewayResponse
      };
      
      if (paymentStatus === 'completed') {
        updateData.paymentDate = new Date();
        
        // Cập nhật trạng thái đơn hàng
        await OrderModel.update(
          { status: 'processing' },
          { where: { id: payment.orderId }, transaction }
        );
      } else if (paymentStatus === 'failed' || paymentStatus === 'cancelled') {
        // Cập nhật trạng thái đơn hàng
        await OrderModel.update(
          { status: 'cancelled' },
          { where: { id: payment.orderId }, transaction }
        );
      }
      
      await PaymentModel.update(
        updateData,
        { where: { id: paymentId }, transaction }
      );
      
      await transaction.commit();
      
      // Lấy thông tin thanh toán đã cập nhật
      const updatedPayment = await PaymentModel.findOne({
        where: { id: paymentId },
        include: [
          {
            model: OrderModel,
            as: 'order',
            attributes: ['id', 'order_date', 'status', 'total_amount']
          },
          {
            model: CustomerModel,
            as: 'customer',
            attributes: ['id', 'name', 'email', 'phone']
          }
        ]
      });
      
      result(updatedPayment);
    } catch (error) {
      await transaction.rollback();
      console.error('Error processing payment:', error);
      result(null);
    }
  },

  // Hoàn tiền
  refund: async (req, res, result) => {
    const transaction = await sequelize.transaction();
    
    try {
      const { paymentId } = req.params;
      const { refundAmount, reason } = req.body;
      
      const payment = await PaymentModel.findOne({
        where: {
          id: paymentId,
          paymentStatus: 'completed',
          deletedAt: null
        },
        transaction
      });
      
      if (!payment) {
        await transaction.rollback();
        return result({ error: 'Không tìm thấy thanh toán hoặc thanh toán chưa hoàn thành' });
      }
      
      if (refundAmount > payment.finalAmount) {
        await transaction.rollback();
        return result({ error: 'Số tiền hoàn không được vượt quá số tiền đã thanh toán' });
      }
      
      // Cập nhật trạng thái thanh toán
      await PaymentModel.update(
        {
          paymentStatus: 'refunded',
          description: `${payment.description || ''} - Hoàn tiền: ${reason || 'Không có lý do'}`
        },
        { where: { id: paymentId }, transaction }
      );
      
      // Cập nhật trạng thái đơn hàng
      await OrderModel.update(
        { status: 'cancelled' },
        { where: { id: payment.orderId }, transaction }
      );
      
      await transaction.commit();
      
      // Lấy thông tin thanh toán đã cập nhật
      const refundedPayment = await PaymentModel.findOne({
        where: { id: paymentId },
        include: [
          {
            model: OrderModel,
            as: 'order',
            attributes: ['id', 'order_date', 'status', 'total_amount']
          },
          {
            model: CustomerModel,
            as: 'customer',
            attributes: ['id', 'name', 'email', 'phone']
          }
        ]
      });
      
      result(refundedPayment);
    } catch (error) {
      await transaction.rollback();
      console.error('Error processing refund:', error);
      result(null);
    }
  },

  // Lấy thống kê thanh toán
  getStatistics: async (req, res, result) => {
    try {
      const { startDate, endDate } = req.query;

      let whereCondition = {
        deletedAt: null
      };

      // Lọc theo khoảng thời gian nếu có
      if (startDate && endDate) {
        whereCondition.createdAt = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }

      // Thống kê tổng quan
      const totalPayments = await PaymentModel.count({
        where: whereCondition
      });

      const totalAmount = await PaymentModel.sum('finalAmount', {
        where: {
          ...whereCondition,
          paymentStatus: 'completed'
        }
      });

      // Thống kê theo trạng thái
      const statusStats = await PaymentModel.findAll({
        where: whereCondition,
        attributes: [
          'paymentStatus',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
          [Sequelize.fn('SUM', Sequelize.col('finalAmount')), 'totalAmount']
        ],
        group: ['paymentStatus']
      });

      // Thống kê theo phương thức thanh toán
      const methodStats = await PaymentModel.findAll({
        where: {
          ...whereCondition,
          paymentStatus: 'completed'
        },
        attributes: [
          'paymentMethod',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
          [Sequelize.fn('SUM', Sequelize.col('finalAmount')), 'totalAmount']
        ],
        group: ['paymentMethod']
      });

      // Thống kê theo ngày (7 ngày gần nhất)
      const dailyStats = await PaymentModel.findAll({
        where: {
          ...whereCondition,
          paymentStatus: 'completed',
          createdAt: {
            [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        attributes: [
          [Sequelize.fn('DATE', Sequelize.col('createdAt')), 'date'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
          [Sequelize.fn('SUM', Sequelize.col('finalAmount')), 'totalAmount']
        ],
        group: [Sequelize.fn('DATE', Sequelize.col('createdAt'))],
        order: [[Sequelize.fn('DATE', Sequelize.col('createdAt')), 'ASC']]
      });

      const statistics = {
        overview: {
          totalPayments,
          totalAmount: totalAmount || 0,
          completedPayments: statusStats.find(s => s.paymentStatus === 'completed')?.dataValues.count || 0
        },
        statusBreakdown: statusStats.map(stat => ({
          status: stat.paymentStatus,
          count: parseInt(stat.dataValues.count),
          totalAmount: parseFloat(stat.dataValues.totalAmount) || 0
        })),
        methodBreakdown: methodStats.map(stat => ({
          method: stat.paymentMethod,
          count: parseInt(stat.dataValues.count),
          totalAmount: parseFloat(stat.dataValues.totalAmount) || 0
        })),
        dailyTrend: dailyStats.map(stat => ({
          date: stat.dataValues.date,
          count: parseInt(stat.dataValues.count),
          totalAmount: parseFloat(stat.dataValues.totalAmount) || 0
        }))
      };

      result(statistics);
    } catch (error) {
      console.error('Error getting payment statistics:', error);
      result(null);
    }
  }
};
