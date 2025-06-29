const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const ShoppingCart = sequelize.define(
    'ShoppingCart',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // Sequelize sẽ tự dùng uuid v4
            primaryKey: true
        },
        customer_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        product_id: {
            type: DataTypes.UUID,
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
