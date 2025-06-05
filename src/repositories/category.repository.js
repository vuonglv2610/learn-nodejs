const CategoryModel = require('../models/category.model');

module.exports = {
    get: async (req, res, result) => {
        try {
            const categories = await CategoryModel.findAll({
                where: {
                    deletedAt: null,
                },
                // todo: add conditions query parameters
            });
            result(categories);
        } catch (error) {
            console.error('Error executing query:', error);
        }
    },

    getOne: async (req, res, result) => {
        try {
            const categories = await CategoryModel.findOne({
                where: {
                    id: req.params.id,
                    deletedAt: null,
                },
                // todo: add conditions query parameters
            });
            result(categories);
        } catch (error) {
            console.error('Error executing query:', error);
        }
    },

    create: async (req, res, result) => {
        try {
            const categories = await CategoryModel.create(req.body);
            result(categories);
        } catch (error) {
            console.error('Error creating category:', error);
        }
    },

    edit: async (req, res, result) => {
        const id = req.params.id;
        try {
            await CategoryModel.update(req.body, {
                where: {
                    id,
                    deletedAt: null,
                },
            });
            const categories = await CategoryModel.findByPk(id);
            result(categories);
        } catch (error) {
            console.error('Error updating categories:', error);
            throw error;
        }
    },

    remove: async (req, res, result) => {
        try {
            const categories = await CategoryModel.destroy({
                where: {
                    id: req.params.id,
                },
            });
            result(categories);
        } catch (error) {
            console.error('Error deleting categories:', error);
        }
    },
};

