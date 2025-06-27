const ProductModel = require('../models/product.model');
const SerialModel = require('../models/serial.model');
const CategoryModel = require('../models/category.model');
const BrandModel = require('../models/brand.model');
const { Op, Sequelize } = require('sequelize');

module.exports = {
  get: async (req, res, result) => {
    try {
      // Xây dựng điều kiện query
      const whereCondition = {
        deletedAt: null,
      };
      
      // Tìm kiếm theo tên sản phẩm
      if (req.query.name) {
        whereCondition.name = {
          [Op.like]: `%${req.query.name}%`
        };
      }
      
      // Tìm kiếm theo SKU
      if (req.query.sku) {
        whereCondition.sku = {
          [Op.like]: `%${req.query.sku}%`
        };
      }
      
      // Tìm kiếm theo danh mục
      if (req.query.categoryId) {
        whereCondition.categoryId = req.query.categoryId;
      }

      // Tìm kiếm theo brand
      if (req.query.brandId) {
        whereCondition.brandId = req.query.brandId;
      }
      
      // Tìm kiếm theo khoảng giá
      if (req.query.minPrice || req.query.maxPrice) {
        whereCondition.price = {};
        
        if (req.query.minPrice) {
          whereCondition.price[Op.gte] = parseFloat(req.query.minPrice);
        }
        
        if (req.query.maxPrice) {
          whereCondition.price[Op.lte] = parseFloat(req.query.maxPrice);
        }
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
        include: [
          {
            model: CategoryModel,
            as: 'category',
            attributes: ['id', 'name']
          },
          {
            model: BrandModel,
            as: 'brand',
            attributes: ['id', 'name'],
            required: false
          }
        ],
        order: order
      };
      
      const products = await ProductModel.findAll(queryOptions);

      // Format dữ liệu trước khi trả về
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
        
        // Thêm các trường phẳng từ đối tượng category
        if (productJson.category) {
          productJson.categoryName = productJson.category.name;
          productJson.categoryId = productJson.category.id;
          // Xóa đối tượng category để tránh lỗi ở frontend
          delete productJson.category;
        }

        // Thêm các trường phẳng từ đối tượng brand
        if (productJson.brand) {
          productJson.brandName = productJson.brand.name;
          productJson.brandId = productJson.brand.id;
          // Xóa đối tượng brand để tránh lỗi ở frontend
          delete productJson.brand;
        }
        
        return productJson;
      }));

      // Trả về tất cả sản phẩm
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
          'id', 'sku', 'name', 'price', 'img', 'description', 'categoryId','brandId', 'createdAt', 'updatedAt'
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
      // Tạo sản phẩm mới (loại bỏ quantity khỏi dữ liệu tạo)
      const { quantity, ...productData } = req.body;
      const product = await ProductModel.create(productData);

      // Lấy sản phẩm đã tạo kèm số lượng serial (không tạo serial tự động)
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
      result(null);
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



