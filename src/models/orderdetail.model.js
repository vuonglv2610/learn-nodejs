const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const OrderDetail = sequelize.define(
  'OrderDetail',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    unit_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    total_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    serial_numbers: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'JSON array of serial numbers for this order detail'
    }
  },
  {
    tableName: 'order_details',
    timestamps: true,
    paranoid: true,
    hooks: {
      beforeSave: (orderDetail, options) => {
        // Tự động tính total_price dựa trên quantity và unit_price
        orderDetail.total_price = orderDetail.quantity * orderDetail.unit_price;
      }
    }
  }
);

module.exports = OrderDetail;
