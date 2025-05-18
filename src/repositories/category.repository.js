const CategoryModel = require('../models/category.model');

module.exports = {
    get: async (req, res, result) => {
        try {
            const products = await CategoryModel.findAll({
                where: {
                    deletedAt: null,
                },
                // todo: add conditions query parameters
            });
            result(products);
        } catch (error) {
            console.error('Error executing query:', error);
        }
    },

    getOne: async (req, res, result) => {
        try {
            const product = await CategoryModel.findOne({
                where: {
                    id: req.params.id,
                    deletedAt: null,
                },
                // todo: add conditions query parameters
            });
            result(product);
        } catch (error) {
            console.error('Error executing query:', error);
        }
    },

    create: async (req, res, result) => {
        try {
            const product = await CategoryModel.create(req.body);
            result(product);
        } catch (error) {
            console.error('Error creating product:', error);
        }
    },

    edit: async (req, res, result) => {
        const id = req.params.id;
        try {
            await Product.update(req.body, {
                where: {
                    id,
                    deletedAt: null,
                },
            });
            const updatedProduct = await CategoryModel.findByPk(id);
            result(updatedProduct);
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    },

    remove: async (req, res, result) => {
        try {
            const product = await CategoryModel.destroy({
                where: {
                    id: req.params.id,
                },
            });
            result(product);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    },
};

