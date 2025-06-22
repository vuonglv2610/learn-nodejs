const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const ShoppingCart = sequelize.define(
    'ShoppingCart',
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        customer_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        product_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: 'shoppingcart',
        timestamps: true,
        paranoid: true,
    }
);

module.exports = ShoppingCart;
