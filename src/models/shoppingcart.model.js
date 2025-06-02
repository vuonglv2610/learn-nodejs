const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const Product = require('./product.model');

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

// Định nghĩa mối quan hệ
ShoppingCart.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

module.exports = ShoppingCart;
