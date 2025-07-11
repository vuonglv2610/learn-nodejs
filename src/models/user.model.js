const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const User = sequelize.define(
  'User',
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
    email: {
      type: DataTypes.STRING(255), // hoặc .STRING nếu mặc định là 255
      allowNull: false,
      unique: true,
    },

    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    confirmPassword: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    google_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'locked'),
      allowNull: false,
      defaultValue: 'active'
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
    tableName: 'users',
    timestamps: true, // thêm createdAt và updatedAt
    paranoid: true, //xóa mềm
  }
);

module.exports = User;
