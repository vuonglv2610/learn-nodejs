const { Op, Sequelize } = require('sequelize');
const sequelize = require('../models/db');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const Customer = require('../models/customer.model');
const Payment = require('../models/payment.model');
const Category = require('../models/category.model');
const Brand = require('../models/brand.model');
const Serial = require('../models/serial.model');

module.exports = {
    // Thống kê doanh thu
    getRevenueStats: async (startDate, endDate, groupBy = 'day') => {
        try {
            let dateFormat;
            switch (groupBy) {
                case 'month':
                    dateFormat = '%Y-%m';
                    break;
                case 'year':
                    dateFormat = '%Y';
                    break;
                default:
                    dateFormat = '%Y-%m-%d';
            }

            const revenueStats = await Payment.findAll({
                attributes: [
                    [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), dateFormat), 'period'],
                    [Sequelize.fn('SUM', Sequelize.col('amount')), 'total_revenue'],
                    [Sequelize.fn('COUNT', Sequelize.col('id')), 'total_transactions']
                ],
                where: {
                    paymentStatus: 'paid',
                    createdAt: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                group: [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), dateFormat)],
                order: [[Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), dateFormat), 'ASC']],
                raw: true
            });

            return revenueStats;
        } catch (error) {
            console.error('Error in getRevenueStats:', error);
            throw error;
        }
    },

    // Thống kê tổng quan dashboard
    getDashboardStats: async (startDate, endDate) => {
        try {
            const today = new Date();
            const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            
            // Sử dụng startDate/endDate nếu có, nếu không thì dùng mặc định
            const queryStartDate = startDate ? new Date(startDate) : startOfToday;
            const queryEndDate = endDate ? new Date(endDate) : new Date();
            
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const startOfYear = new Date(today.getFullYear(), 0, 1);

            // Doanh thu trong khoảng thời gian
            const periodRevenue = await Payment.sum('amount', {
                where: {
                    paymentStatus: 'paid',
                    createdAt: {
                        [Op.between]: [queryStartDate, queryEndDate]
                    }
                }
            });

            // Đơn hàng trong khoảng thời gian
            const periodOrders = await Order.count({
                where: {
                    createdAt: {
                        [Op.between]: [queryStartDate, queryEndDate]
                    }
                }
            });

            // Khách hàng mới trong khoảng thời gian
            const newCustomersPeriod = await Customer.count({
                where: {
                    createdAt: {
                        [Op.between]: [queryStartDate, queryEndDate]
                    }
                }
            });

            // Giữ nguyên các thống kê cũ
            const todayRevenue = await Payment.sum('amount', {
                where: {
                    paymentStatus: 'paid',
                    createdAt: { [Op.gte]: startOfToday }
                }
            });

            const monthRevenue = await Payment.sum('amount', {
                where: {
                    paymentStatus: 'paid',
                    createdAt: { [Op.gte]: startOfMonth }
                }
            });

            const yearRevenue = await Payment.sum('amount', {
                where: {
                    paymentStatus: 'paid',
                    createdAt: { [Op.gte]: startOfYear }
                }
            });

            const totalOrders = await Order.count();
            const todayOrders = await Order.count({
                where: { createdAt: { [Op.gte]: startOfToday } }
            });

            const totalCustomers = await Customer.count();
            const newCustomersToday = await Customer.count({
                where: { createdAt: { [Op.gte]: startOfToday } }
            });

            const totalProducts = await Product.count();
            const pendingOrders = await Order.count({
                where: { status: 'pending' }
            });

            return {
                // Thống kê theo khoảng thời gian (nếu có startDate/endDate)
                period: startDate && endDate ? {
                    revenue: periodRevenue || 0,
                    orders: periodOrders,
                    newCustomers: newCustomersPeriod,
                    startDate,
                    endDate
                } : null,
                // Thống kê cũ (giữ nguyên để không break frontend)
                revenue: {
                    today: todayRevenue || 0,
                    month: monthRevenue || 0,
                    year: yearRevenue || 0
                },
                orders: {
                    total: totalOrders,
                    today: todayOrders,
                    pending: pendingOrders
                },
                customers: {
                    total: totalCustomers,
                    newToday: newCustomersToday
                },
                products: {
                    total: totalProducts
                }
            };
        } catch (error) {
            console.error('Error in getDashboardStats:', error);
            throw error;
        }
    },

    // Thống kê đơn hàng theo trạng thái
    getOrderStatusStats: async (startDate, endDate) => {
        try {
            const orderStats = await Order.findAll({
                attributes: [
                    'status',
                    [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
                    [Sequelize.fn('SUM', Sequelize.col('total_amount')), 'total_amount']
                ],
                where: {
                    createdAt: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                group: ['status'],
                raw: true
            });

            return orderStats;
        } catch (error) {
            console.error('Error in getOrderStatusStats:', error);
            throw error;
        }
    },

    // Top sản phẩm bán chạy
    getTopSellingProducts: async (limit = 10, startDate, endDate) => {
        try {
            const topProducts = await sequelize.query(`
                SELECT
                    p.id,
                    p.name,
                    p.price,
                    p.img,
                    b.name as brand_name,
                    c.name as category_name,
                    COALESCE(SUM(od.quantity), 0) as sold_quantity,
                    COALESCE(SUM(od.total_price), 0) as total_revenue
                FROM products p
                LEFT JOIN order_details od ON p.id = od.productId
                LEFT JOIN orders o ON od.orderId = o.id
                LEFT JOIN brands b ON p.brandId = b.id
                LEFT JOIN categories c ON p.categoryId = c.id
                WHERE (o.createdAt BETWEEN :startDate AND :endDate OR o.createdAt IS NULL)
                    AND (o.status IN ('confirmed', 'processing', 'shipped', 'delivered') OR o.status IS NULL)
                    AND (o.deletedAt IS NULL OR o.deletedAt IS NULL)
                    AND (od.deletedAt IS NULL OR od.deletedAt IS NULL)
                GROUP BY p.id, p.name, p.price, p.img, b.name, c.name
                HAVING sold_quantity > 0
                ORDER BY sold_quantity DESC
                LIMIT :limit
            `, {
                replacements: { startDate, endDate, limit },
                type: Sequelize.QueryTypes.SELECT
            });

            return topProducts;
        } catch (error) {
            console.error('Error in getTopSellingProducts:', error);
            throw error;
        }
    },

    // Thống kê khách hàng
    getCustomerStats: async (startDate, endDate) => {
        try {
            // Khách hàng mới theo thời gian
            const newCustomers = await Customer.findAll({
                attributes: [
                    [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m-%d'), 'date'],
                    [Sequelize.fn('COUNT', Sequelize.col('id')), 'new_customers']
                ],
                where: {
                    createdAt: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                group: [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m-%d')],
                order: [[Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m-%d'), 'ASC']],
                raw: true
            });

            // Top khách hàng theo doanh thu
            const topCustomers = await sequelize.query(`
                SELECT
                    c.id,
                    c.name,
                    c.email,
                    c.phone,
                    COUNT(DISTINCT o.id) as total_orders,
                    SUM(p.amount) as total_spent
                FROM customers c
                LEFT JOIN orders o ON c.id = o.customerId
                LEFT JOIN payments p ON o.id = p.orderId AND p.paymentStatus = 'completed'
                WHERE o.createdAt BETWEEN :startDate AND :endDate
                GROUP BY c.id, c.name, c.email, c.phone
                HAVING total_spent > 0
                ORDER BY total_spent DESC
                LIMIT 10
            `, {
                replacements: { startDate, endDate },
                type: Sequelize.QueryTypes.SELECT
            });

            return {
                newCustomers,
                topCustomers
            };
        } catch (error) {
            console.error('Error in getCustomerStats:', error);
            throw error;
        }
    },

    // Thống kê sản phẩm theo danh mục
    getProductCategoryStats: async (startDate, endDate) => {
        try {
            const categoryStats = await sequelize.query(`
                SELECT
                    c.id,
                    c.name as category_name,
                    COUNT(DISTINCT p.id) as total_products,
                    COALESCE(SUM(od.quantity), 0) as sold_quantity,
                    COALESCE(SUM(od.total_price), 0) as total_revenue
                FROM categories c
                LEFT JOIN products p ON c.id = p.categoryId
                LEFT JOIN order_details od ON p.id = od.productId
                LEFT JOIN orders o ON od.orderId = o.id
                WHERE (o.createdAt BETWEEN :startDate AND :endDate OR o.createdAt IS NULL)
                    AND (o.status IN ('confirmed', 'processing', 'shipped', 'delivered') OR o.status IS NULL)
                    AND (o.deletedAt IS NULL OR o.deletedAt IS NULL)
                    AND (od.deletedAt IS NULL OR od.deletedAt IS NULL)
                GROUP BY c.id, c.name
                ORDER BY total_revenue DESC
            `, {
                replacements: { startDate, endDate },
                type: Sequelize.QueryTypes.SELECT
            });

            return categoryStats;
        } catch (error) {
            console.error('Error in getProductCategoryStats:', error);
            throw error;
        }
    },

    // Thống kê theo thương hiệu
    getBrandStats: async (startDate, endDate) => {
        try {
            const brandStats = await sequelize.query(`
                SELECT
                    b.id,
                    b.name as brand_name,
                    b.logo,
                    COUNT(DISTINCT p.id) as total_products,
                    COALESCE(SUM(od.quantity), 0) as sold_quantity,
                    COALESCE(SUM(od.total_price), 0) as total_revenue
                FROM brands b
                LEFT JOIN products p ON b.id = p.brandId
                LEFT JOIN order_details od ON p.id = od.productId
                LEFT JOIN orders o ON od.orderId = o.id
                WHERE (o.createdAt BETWEEN :startDate AND :endDate OR o.createdAt IS NULL)
                    AND (o.status IN ('confirmed', 'processing', 'shipped', 'delivered') OR o.status IS NULL)
                    AND (o.deletedAt IS NULL OR o.deletedAt IS NULL)
                    AND (od.deletedAt IS NULL OR od.deletedAt IS NULL)
                GROUP BY b.id, b.name, b.logo
                ORDER BY total_revenue DESC
            `, {
                replacements: { startDate, endDate },
                type: Sequelize.QueryTypes.SELECT
            });

            return brandStats;
        } catch (error) {
            console.error('Error in getBrandStats:', error);
            throw error;
        }
    },

    // Thống kê phương thức thanh toán
    getPaymentMethodStats: async (startDate, endDate) => {
        try {
            const paymentStats = await Payment.findAll({
                attributes: [
                    'paymentMethod',
                    [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
                    [Sequelize.fn('SUM', Sequelize.col('amount')), 'total_amount']
                ],
                where: {
                    paymentStatus: 'paid',
                    createdAt: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                group: ['paymentMethod'],
                order: [[Sequelize.fn('SUM', Sequelize.col('amount')), 'DESC']],
                raw: true
            });

            return paymentStats;
        } catch (error) {
            console.error('Error in getPaymentMethodStats:', error);
            throw error;
        }
    },

    // So sánh doanh thu với kỳ trước
    getRevenueComparison: async (currentStart, currentEnd, previousStart, previousEnd) => {
        try {
            const currentRevenue = await Payment.sum('amount', {
                where: {
                    paymentStatus: 'paid',
                    createdAt: {
                        [Op.between]: [currentStart, currentEnd]
                    }
                }
            });

            const previousRevenue = await Payment.sum('amount', {
                where: {
                    paymentStatus: 'paid',
                    createdAt: {
                        [Op.between]: [previousStart, previousEnd]
                    }
                }
            });

            const growth = previousRevenue > 0 ?
                ((currentRevenue - previousRevenue) / previousRevenue * 100) : 0;

            return {
                current: currentRevenue || 0,
                previous: previousRevenue || 0,
                growth: Math.round(growth * 100) / 100
            };
        } catch (error) {
            console.error('Error in getRevenueComparison:', error);
            throw error;
        }
    }
};

