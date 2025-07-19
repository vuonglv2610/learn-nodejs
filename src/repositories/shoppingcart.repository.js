const ShoppingCart = require('../models/shoppingcart.model');
const { Op } = require('sequelize');

module.exports = {
    get: async (req, res, result) => {
        try {
            // Xây dựng điều kiện query
            const whereCondition = {
                deletedAt: null,
            };
            
            // Tìm kiếm theo customerId
            if (req.query.customerId) {
                whereCondition.customerId = req.query.customerId;
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
                        model: require('../models/product.model'),
                        as: 'product',
                        attributes: ['id', 'name', 'price', 'img', 'description', 'sku']
                    }
                ],
                order: order
            };
            
            const cartList = await ShoppingCart.findAll(queryOptions);
            
            // Trả về tất cả giỏ hàng
            result(cartList);
        } catch (error) {
            console.error('Error executing query:', error);
            result(null);
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
            // Xây dựng điều kiện query
            const whereCondition = {
                customer_id: req.params.customerId,
                deletedAt: null,
            };
            
            // Thêm điều kiện tìm kiếm theo product_id nếu có
            if (req.query.product_id) {
                whereCondition.product_id = req.query.product_id;
            }
            
            // Tìm kiếm theo tên sản phẩm nếu có
            const includeOptions = {
                model: require('../models/product.model'),
                as: 'product',
                attributes: ['id', 'name', 'price', 'img', 'description', 'sku']
            };
            
            if (req.query.product_name) {
                includeOptions.where = {
                    name: {
                        [Op.like]: `%${req.query.product_name}%`
                    }
                };
            }
            
            // Xử lý sắp xếp
            const order = [];
            if (req.query.sort_by) {
                order.push([req.query.sort_by, req.query.sort_order || 'ASC']);
            } else {
                order.push(['createdAt', 'DESC']);
            }
            
            const cart = await ShoppingCart.findAll({
                where: whereCondition,
                include: [includeOptions],
                order: order
            });
            
            result(cart);
        } catch (error) {
            console.error('Error executing query:', error);
            result(null);
        }
    },

    create: async (req, res, result) => {
        try {
            // Kiểm tra dữ liệu đầu vào
            if (!req.body.customer_id || !req.body.product_id || !req.body.quantity) {
                return result(null);
            }
            
            // Kiểm tra số lượng sản phẩm có sẵn
            const SerialModel = require('../models/serial.model');
            const availableQuantity = await SerialModel.count({
                where: {
                    productId: req.body.product_id,
                    deletedAt: null
                }
            });
            
            // Kiểm tra xem sản phẩm đã có trong giỏ hàng của khách hàng chưa
            const existingCartItem = await ShoppingCart.findOne({
                where: {
                    customer_id: req.body.customer_id,
                    product_id: req.body.product_id,
                    deletedAt: null
                }
            });
            
            let cart;
            const requestedQuantity = parseInt(req.body.quantity, 10);
            
            if (existingCartItem) {
                // Nếu sản phẩm đã có trong giỏ hàng, tính tổng số lượng mới
                const newQuantity = existingCartItem.quantity + requestedQuantity;
                
                // Kiểm tra số lượng không vượt quá số lượng có sẵn
                if (newQuantity > availableQuantity) {
                    console.log(`Không đủ hàng: yêu cầu ${newQuantity}, có sẵn ${availableQuantity}`);
                    return result({ error: `Không đủ hàng trong kho. Số lượng có sẵn: ${availableQuantity}, số lượng trong giỏ: ${existingCartItem.quantity}` });
                }
                
                await ShoppingCart.update(
                    { quantity: newQuantity },
                    {
                        where: {
                            id: existingCartItem.id
                        }
                    }
                );
                
                // Lấy thông tin giỏ hàng sau khi cập nhật
                cart = await ShoppingCart.findByPk(existingCartItem.id);
            } else {
                // Nếu sản phẩm chưa có trong giỏ hàng, kiểm tra số lượng yêu cầu
                if (requestedQuantity > availableQuantity) {
                    console.log(`Không đủ hàng: yêu cầu ${requestedQuantity}, có sẵn ${availableQuantity}`);
                    return result({ error: `Không đủ hàng trong kho. Số lượng có sẵn: ${availableQuantity}` });
                }
                
                // Tạo mới
                cart = await ShoppingCart.create(req.body);
            }
            
            console.log('cart', cart);
            result(cart);
        } catch (error) {
            console.error('Error creating cart:', error);
            result(null);
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

