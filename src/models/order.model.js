const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Order = sequelize.define(
  'Order',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Sequelize sẽ tự dùng uuid v4
      primaryKey: true
    },
    customer_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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