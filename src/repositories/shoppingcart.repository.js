const ShoppingCart = require('../models/shoppingcart.model');

module.exports = {
    get: async (req, res, result) => {
        try {
            const cartList = await ShoppingCart.findAll({
                where: {
                    deletedAt: null,
                },
                // todo: add conditions query parameters
            });
            result(cartList);
        } catch (error) {
            console.error('Error executing query:', error);
        }
    },

    getOne: async (req, res, result) => {
        try {
            const cart = await ShoppingCart.findOne({
                where: {
                    id: req.params.id,
                    deletedAt: null,
                },
                // todo: add conditions query parameters
            });
            result(cart);
        } catch (error) {
            console.error('Error executing query:', error);
        }
    },

    getOneByCustomerId: async (req, res, result) => {
        try {
            const cart = await ShoppingCart.findAll({
                where: {
                    customer_id: req.params.customerId,
                    deletedAt: null,
                },
                include: [
                    {
                        model: require('../models/product.model'),
                        as: 'product',
                        attributes: ['id', 'name', 'price', 'img', 'description', 'sku', 'quantity']
                    }
                ]
            });
            result(cart);
        } catch (error) {
            console.error('Error executing query:', error);
        }
    },

    create: async (req, res, result) => {
        try {
            const cart = await ShoppingCart.create(req.body);
            result(cart);
        } catch (error) {
            console.error('Error creating cart:', error);
        }
    },

    edit: async (req, res, result) => {
        const id = req.params.id;
        try {
            await ShoppingCart.update(req.body, {
                where: {
                    id,
                    deletedAt: null,
                },
            });
            const updatedCart = await ShoppingCart.findByPk(id);
            result(updatedCart);
        } catch (error) {
            console.error('Error updating cart:', error);
            throw error;
        }
    },

    remove: async (req, res, result) => {
        try {
            const cart = await ShoppingCart.destroy({
                where: {
                    id: req.params.id,
                },
            });
            result(cart);
        } catch (error) {
            console.error('Error deleting cart:', error);
        }
    },
};

