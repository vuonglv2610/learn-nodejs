const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Serial = sequelize.define(
  'Serial',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Sequelize sẽ tự dùng uuid v4
      primaryKey: true
    },
    serial: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    productId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
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

module.exports = Serial;