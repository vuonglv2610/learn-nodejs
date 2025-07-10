const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Payment = sequelize.define(
  'Payment',
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
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    paymentMethod: {
      type: DataTypes.ENUM('cash','vnpay'),
      allowNull: false,
      defaultValue: 'cash'
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
      allowNull: false,
      defaultValue: 'pending'
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    voucherId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    discountAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    finalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    paymentGatewayResponse: {
      type: DataTypes.JSON,
      allowNull: true
    }
  },
  {
    tableName: 'payments',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        fields: ['orderId']
      },
      {
        fields: ['customerId']
      },
      {
        fields: ['paymentStatus']
      },
      {
        fields: ['transactionId']
      }
    ]
  }
);

module.exports = Payment;
