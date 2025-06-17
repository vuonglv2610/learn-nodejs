const CategoryModel = require('../models/category.model');
const { Op } = require('sequelize');

module.exports = {
    get: async (req, res, result) => {
        try {
            // Xây dựng điều kiện query
            const whereCondition = {
                deletedAt: null,
            };
            
            // Tìm kiếm theo tên danh mục
            if (req.query.name) {
                whereCondition.name = {
                    [Op.like]: `%${req.query.name}%`
                };
            }
            
            // Xử lý sắp xếp
            const order = [];
            if (req.query.sort_by) {
                order.push([req.query.sort_by, req.query.sort_order || 'ASC']);
            } else {
                order.push(['createdAt', 'DESC']);
            }
            
            // Chuẩn bị options cho query
            const queryOptions = {
                where: whereCondition,
                order: order
            };
            
            const categories = await CategoryModel.findAll(queryOptions);
            
            // Trả về tất cả danh mục
            result(categories);
        } catch (error) {
            console.error('Error executing query:', error);
            result(null);
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

