const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Comment = sequelize.define(
    'Comment',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // Sequelize sẽ tự dùng uuid v4
            primaryKey: true
        },
        comment: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        customerId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        productId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        isVerifiedPurchase: {
            type: DataTypes.BOOLEAN,
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
        tableName: 'comments',
        timestamps: true, // thêm createdAt và updatedAt
        paranoid: true, //xóa mềm
    }
);

module.exports = Comment;
