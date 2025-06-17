const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const ShoppingCart = sequelize.define(
    'ShoppingCart',
    {
        customer_id: {
            type: DataTypes.INTEGER,
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
