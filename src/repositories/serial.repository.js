const SerialModel = require('../models/serial.model');
const ProductModel = require('../models/product.model');
const { Op } = require('sequelize');

module.exports = {
  get: async (req, res, result) => {
    try {
      // Xây dựng điều kiện query
      const whereCondition = {
        deletedAt: null,
      };
      
      // Tìm kiếm theo mã serial
      if (req.query.serial) {
        whereCondition.serial = {
          [Op.like]: `%${req.query.serial}%`
        };
      }
      
      // Tìm kiếm theo productId
      if (req.query.productId) {
        whereCondition.productId = req.query.productId;
      }
      
      // Tìm kiếm theo trạng thái
      if (req.query.status !== undefined) {
        whereCondition.status = req.query.status;
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
            model: ProductModel,
            as: 'product',
            attributes: ['id', 'name', 'sku', 'price']
          }
        ],
        order: order
      };
      
      const serials = await SerialModel.findAll(queryOptions);

      // Format dữ liệu trước khi trả về
      const formattedSerials = serials.map(serial => {
        const serialJson = serial.toJSON();
        
        // Thêm các trường phẳng từ đối tượng product
        if (serialJson.product) {
          serialJson.productName = serialJson.product.name;
          serialJson.productSku = serialJson.product.sku;
          serialJson.productPrice = serialJson.product.price;
          // Xóa đối tượng product để tránh lỗi ở frontend
          delete serialJson.product;
        }
        
        return serialJson;
      });

      // Trả về tất cả serial
      result(formattedSerials);
    } catch (error) {
      console.error('Error executing query:', error);
      result(null);
    }
  },

  getOne: async (req, res, result) => {
    try {
      const serial = await SerialModel.findOne({
        where: {
          id: req.params.id,
          deletedAt: null,
        },
        include: [
          {
            model: ProductModel,
            as: 'product',
            attributes: ['id', 'name', 'sku']
          }
        ]
      });
      result(serial);
    } catch (error) {
      console.error('Error executing query:', error);
    }
  },

  getByProductId: async (req, res, result) => {
    try {
      const whereCondition = {
        productId: req.params.productId,
        deletedAt: null,
      };
      
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
      
      const serials = await SerialModel.findAll(queryOptions);
      
      // Trả về tất cả serial của sản phẩm
      result(serials);
    } catch (error) {
      console.error('Error executing query:', error);
      result(null);
    }
  },

  create: async (req, res, result) => {
    try {
      // Kiểm tra xem serial đã tồn tại chưa
      const existingSerial = await SerialModel.findOne({
        where: {
          serial: req.body.serial
        }
      });

      if (existingSerial) {
        return Response.fail(req, res, 400, 'Serial đã tồn tại');
      }

      // Kiểm tra xem productId có tồn tại không
      const product = await ProductModel.findByPk(req.body.productId);
      if (!product) {
        return Response.fail(req, res, 404, 'Sản phẩm không tồn tại');
      }

      const serial = await SerialModel.create(req.body);
      result(serial);
    } catch (error) {
      console.error('Error creating serial:', error);
    }
  },

  edit: async (req, res, result) => {
    const id = req.params.id;
    try {
      // Kiểm tra xem serial có tồn tại không
      const existingSerial = await SerialModel.findByPk(id);
      if (!existingSerial) {
        return Response.fail(req, res, 404, 'Serial không tồn tại');
      }

      // Kiểm tra xem serial mới đã tồn tại chưa (nếu có thay đổi serial)
      if (req.body.serial && req.body.serial !== existingSerial.serial) {
        const duplicateSerial = await SerialModel.findOne({
          where: {
            serial: req.body.serial,
            id: { [require('sequelize').Op.ne]: id }
          }
        });

        if (duplicateSerial) {
          return Response.fail(req, res, 400, 'Serial đã tồn tại');
        }
      }

      // Kiểm tra xem productId có tồn tại không (nếu có thay đổi productId)
      if (req.body.productId) {
        const product = await ProductModel.findByPk(req.body.productId);
        if (!product) {
          return Response.fail(req, res, 404, 'Sản phẩm không tồn tại');
        }
      }

      await SerialModel.update(req.body, {
        where: {
          id,
          deletedAt: null,
        },
      });
      
      const updatedSerial = await SerialModel.findByPk(id, {
        include: [
          {
            model: ProductModel,
            as: 'product',
            attributes: ['id', 'name', 'sku']
          }
        ]
      });
      
      result(updatedSerial);
    } catch (error) {
      console.error('Error updating serial:', error);
    }
  },

  remove: async (req, res, result) => {
    try {
      const serial = await SerialModel.destroy({
        where: {
          id: req.params.id,
        },
      });
      result(serial);
    } catch (error) {
      console.error('Error deleting serial:', error);
    }
  },

  // Tạo nhiều serial cùng lúc
  bulkCreate: async (req, res, result) => {
    try {
      const { productId, count, prefix } = req.body;
      
      // Kiểm tra xem productId có tồn tại không
      const product = await ProductModel.findByPk(productId);
      if (!product) {
        return Response.fail(req, res, 404, 'Sản phẩm không tồn tại');
      }
      
      // Kiểm tra count
      if (!count || count <= 0 || count > 1000) {
        return Response.fail(req, res, 400, 'Số lượng serial phải từ 1 đến 1000');
      }
      
      const serialsToCreate = [];
      const serialPrefix = prefix || product.sku || 'SER';
      
      // Tạo danh sách serial
      for (let i = 0; i < count; i++) {
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
        const serial = `${serialPrefix}-${timestamp}-${randomStr}`;
        
        serialsToCreate.push({
          serial,
          productId
        });
      }
      
      // Tạo nhiều serial cùng lúc
      const createdSerials = await SerialModel.bulkCreate(serialsToCreate);
      result(createdSerials);
    } catch (error) {
      console.error('Error bulk creating serials:', error);
    }
  }
};
