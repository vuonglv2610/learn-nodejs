const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Roles = sequelize.define(
    'Roles',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role_key: {
            type: DataTypes.STRING,
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
        tableName: 'roles',
        timestamps: true, // thêm createdAt và updatedAt
        paranoid: true, //xóa mềm
    }
);

module.exports = Roles;

