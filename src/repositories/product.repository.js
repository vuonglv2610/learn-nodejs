const ProductModel = require('../models/product.model');
const SerialModel = require('../models/serial.model');
const { Sequelize } = require('sequelize');

module.exports = {
  get: async (req, res, result) => {
    try {
      // Lấy danh sách sản phẩm kèm số lượng serial
      const products = await ProductModel.findAll({
        where: {
          deletedAt: null,
        },
        attributes: [
          'id', 'sku', 'name', 'price', 'img', 'description', 'categoryId', 'createdAt', 'updatedAt'
        ],
        order: [['id', 'ASC']]
      });

      // Lấy số lượng serial cho từng sản phẩm
      const formattedProducts = await Promise.all(products.map(async (product) => {
        const productJson = product.toJSON();
        
        // Đếm số lượng serial cho sản phẩm này
        const serialCount = await SerialModel.count({
          where: {
            productId: product.id,
            deletedAt: null
          }
        });
        
        productJson.quantity = serialCount;
        return productJson;
      }));

      result(formattedProducts);
    } catch (error) {
      console.error('Error executing query:', error);
      result(null);
    }
  },

  getOne: async (req, res, result) => {
    try {
      const productId = req.params.id;
      
      // Lấy thông tin sản phẩm
      const product = await ProductModel.findOne({
        where: {
          id: productId,
          deletedAt: null,
        },
        attributes: [
          'id', 'sku', 'name', 'price', 'img', 'description', 'categoryId', 'createdAt', 'updatedAt'
        ]
      });

      if (!product) {
        return result(null);
      }

      // Đếm số lượng serial cho sản phẩm này
      const serialCount = await SerialModel.count({
        where: {
          productId: productId,
          deletedAt: null
        }
      });
      
      // Log để debug
      console.log(`Product ID: ${productId}, Serial Count: ${serialCount}`);
      console.log(`SQL Query: SELECT COUNT(*) FROM serials WHERE productId = ${productId} AND deletedAt IS NULL`);
      
      // Kiểm tra trực tiếp các serial có productId này
      const serials = await SerialModel.findAll({
        where: {
          productId: productId,
          deletedAt: null
        }
      });
      
      console.log(`Found serials:`, serials.map(s => s.id));
      
      const productJson = product.toJSON();
      productJson.quantity = serialCount;
      
      result(productJson);
    } catch (error) {
      console.error('Error executing query:', error);
      console.error(error.stack);
      result(null);
    }
  },

  create: async (req, res, result) => {
    try {
      // Tạo sản phẩm mới (không có quantity)
      const { quantity, ...productData } = req.body;
      const product = await ProductModel.create(productData);
      
      // Nếu có quantity, tạo các serial tương ứng
      if (quantity && quantity > 0) {
        const serialsToCreate = [];
        const serialPrefix = product.sku || 'SER';
        
        for (let i = 0; i < quantity; i++) {
          const timestamp = Date.now();
          const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
          const serial = `${serialPrefix}-${timestamp}-${randomStr}`;
          
          serialsToCreate.push({
            serial,
            productId: product.id
          });
        }
        
        // Tạo nhiều serial cùng lúc
        await SerialModel.bulkCreate(serialsToCreate);
      }
      
      // Lấy sản phẩm đã tạo kèm số lượng serial
      const createdProduct = await ProductModel.findOne({
        where: {
          id: product.id,
          deletedAt: null,
        },
        include: [
          {
            model: SerialModel,
            as: 'serials',
            attributes: [],
            where: {
              deletedAt: null
            },
            required: false
          }
        ],
        attributes: [
          'id', 'sku', 'name', 'price', 'img', 'description', 'categoryId', 'createdAt', 'updatedAt',
          [Sequelize.fn('COUNT', Sequelize.col('serials.id')), 'quantity']
        ],
        group: ['Product.id']
      });
      
      if (createdProduct) {
        const productJson = createdProduct.toJSON();
        productJson.quantity = parseInt(productJson.quantity, 10);
        result(productJson);
      } else {
        result(product);
      }
    } catch (error) {
      console.error('Error creating product:', error);
    }
  },

  edit: async (req, res, result) => {
    const id = req.params.id;
    try {
      // Lấy số lượng hiện tại
      const currentProduct = await ProductModel.findOne({
        where: {
          id,
          deletedAt: null,
        },
        include: [
          {
            model: SerialModel,
            as: 'serials',
            attributes: [],
            where: {
              deletedAt: null
            },
            required: false
          }
        ],
        attributes: [
          'id', 'sku', 'name', 'price', 'img', 'description', 'categoryId',
          [Sequelize.fn('COUNT', Sequelize.col('serials.id')), 'quantity']
        ],
        group: ['Product.id']
      });
      
      if (!currentProduct) {
        return result(null);
      }
      
      const currentQuantity = parseInt(currentProduct.get('quantity'), 10);
      
      // Cập nhật thông tin sản phẩm (không bao gồm quantity)
      const { quantity, ...updateData } = req.body;
      await ProductModel.update(updateData, {
        where: {
          id,
          deletedAt: null,
        },
      });
      
      // Nếu có thay đổi số lượng
      if (quantity !== undefined) {
        const newQuantity = parseInt(quantity, 10);
        
        if (newQuantity > currentQuantity) {
          // Thêm serial mới
          const serialsToCreate = [];
          const serialPrefix = updateData.sku || currentProduct.sku || 'SER';
          
          for (let i = 0; i < (newQuantity - currentQuantity); i++) {
            const timestamp = Date.now();
            const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
            const serial = `${serialPrefix}-${timestamp}-${randomStr}`;
            
            serialsToCreate.push({
              serial,
              productId: id
            });
          }
          
          // Tạo nhiều serial cùng lúc
          await SerialModel.bulkCreate(serialsToCreate);
        } else if (newQuantity < currentQuantity) {
          // Xóa bớt serial
          const serialsToDelete = await SerialModel.findAll({
            where: {
              productId: id,
              deletedAt: null
            },
            order: [['createdAt', 'DESC']],
            limit: currentQuantity - newQuantity
          });
          
          for (const serial of serialsToDelete) {
            await serial.destroy();
          }
        }
      }
      
      // Lấy sản phẩm đã cập nhật kèm số lượng serial
      const updatedProduct = await ProductModel.findOne({
        where: {
          id,
          deletedAt: null,
        },
        include: [
          {
            model: SerialModel,
            as: 'serials',
            attributes: [],
            where: {
              deletedAt: null
            },
            required: false
          }
        ],
        attributes: [
          'id', 'sku', 'name', 'price', 'img', 'description', 'categoryId', 'createdAt', 'updatedAt',
          [Sequelize.fn('COUNT', Sequelize.col('serials.id')), 'quantity']
        ],
        group: ['Product.id']
      });
      
      if (updatedProduct) {
        const productJson = updatedProduct.toJSON();
        productJson.quantity = parseInt(productJson.quantity, 10);
        result(productJson);
      } else {
        result(null);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  remove: async (req, res, result) => {
    try {
      // Xóa tất cả serial của sản phẩm
      await SerialModel.destroy({
        where: {
          productId: req.params.id,
        },
      });
      
      // Xóa sản phẩm
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
