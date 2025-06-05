const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Customer = sequelize.define(
    'Customer',
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // Thêm các trường khác nếu cần
    },
    {
        tableName: 'customers',
        timestamps: true,
        paranoid: true,
    }
);

module.exports = Customer;