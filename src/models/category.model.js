const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Category = sequelize.define(
  'Category',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Sequelize sẽ tự dùng uuid v4
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: 'categories',
    timestamps: true, // thêm createdAt và updatedAt
    paranoid: true, //xóa mềm
  }
);

module.exports = Category;
