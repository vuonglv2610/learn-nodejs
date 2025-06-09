const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const Product = require('./product.model');

const Serial = sequelize.define(
  'Serial',
  {
    serial: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'serials',
    timestamps: true, // thêm createdAt và updatedAt
    paranoid: true, // xóa mềm (soft delete)
  }
);

// Thiết lập mối quan hệ với Product
Serial.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(Serial, { foreignKey: 'productId', as: 'serials' });

module.exports = Serial;