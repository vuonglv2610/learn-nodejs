const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Voucher = sequelize.define(
    'Voucher',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // Sequelize sẽ tự dùng uuid v4
            primaryKey: true
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        discount_percent: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        end_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        used: {
            type: DataTypes.INTEGER,
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
        tableName: 'vouchers',
        timestamps: true, // thêm createdAt và updatedAt
        paranoid: true, //xóa mềm
    }
);

module.exports = Voucher;
