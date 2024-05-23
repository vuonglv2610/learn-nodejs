const ProductModel = require('../models/product.model');

module.exports = {
  get: async (req, res, result) => {
    try {
      const products = await ProductModel.findAll({
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
      const product = await ProductModel.findOne({
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
      const product = await ProductModel.create(req.body);
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
      const updatedProduct = await ProductModel.findByPk(id);
      result(updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  remove: async (req, res, result) => {
    try {
      const product = await ProductModel.destroy({
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

