const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Order = sequelize.define(
  'Order',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    customer_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
      defaultValue: 'pending',
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: 'orders',
    timestamps: true,
    paranoid: true,
  }
);

module.exports = Order;