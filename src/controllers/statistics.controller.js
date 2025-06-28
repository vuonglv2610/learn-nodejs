const statisticsRepository = require('../repositories/statistics.repository');
const { success, fail } = require('../helpers/response');

module.exports = {
    // API dashboard tổng quan
    getDashboard: async (req, res) => {
        try {
            const dashboardData = await statisticsRepository.getDashboardStats();
            return success(req, res, dashboardData, 200);
        } catch (error) {
            console.error('Error in getDashboard:', error);
            return fail(req, res, 500, 'Lỗi khi lấy thống kê dashboard');
        }
    },

    // API thống kê doanh thu
    getRevenue: async (req, res) => {
        try {
            const { startDate, endDate, groupBy = 'day' } = req.query;

            if (!startDate || !endDate) {
                return fail(req, res, 400, 'Vui lòng cung cấp startDate và endDate');
            }

            const revenueData = await statisticsRepository.getRevenueStats(
                new Date(startDate),
                new Date(endDate),
                groupBy
            );

            return success(req, res, revenueData, 200);
        } catch (error) {
            console.error('Error in getRevenue:', error);
            return fail(req, res, 500, 'Lỗi khi lấy thống kê doanh thu');
        }
    },

    // API so sánh doanh thu
    getRevenueComparison: async (req, res) => {
        try {
            const { currentStart, currentEnd, previousStart, previousEnd } = req.query;

            if (!currentStart || !currentEnd || !previousStart || !previousEnd) {
                return fail(req, res, 400, 'Vui lòng cung cấp đầy đủ thông tin thời gian');
            }

            const comparisonData = await statisticsRepository.getRevenueComparison(
                new Date(currentStart),
                new Date(currentEnd),
                new Date(previousStart),
                new Date(previousEnd)
            );

            return success(req, res, comparisonData, 200);
        } catch (error) {
            console.error('Error in getRevenueComparison:', error);
            return fail(req, res, 500, 'Lỗi khi so sánh doanh thu');
        }
    },

    // API thống kê đơn hàng
    getOrders: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                return fail(req, res, 400, 'Vui lòng cung cấp startDate và endDate');
            }

            const orderData = await statisticsRepository.getOrderStatusStats(
                new Date(startDate),
                new Date(endDate)
            );

            return success(req, res, orderData, 200);
        } catch (error) {
            console.error('Error in getOrders:', error);
            return fail(req, res, 500, 'Lỗi khi lấy thống kê đơn hàng');
        }
    },

    // API top sản phẩm bán chạy
    getTopProducts: async (req, res) => {
        try {
            const { startDate, endDate, limit = 10 } = req.query;

            if (!startDate || !endDate) {
                return fail(req, res, 400, 'Vui lòng cung cấp startDate và endDate');
            }

            const topProducts = await statisticsRepository.getTopSellingProducts(
                parseInt(limit),
                new Date(startDate),
                new Date(endDate)
            );

            return success(req, res, topProducts, 200);
        } catch (error) {
            console.error('Error in getTopProducts:', error);
            return fail(req, res, 500, 'Lỗi khi lấy top sản phẩm bán chạy');
        }
    },

    // API thống kê khách hàng
    getCustomers: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                return fail(req, res, 400, 'Vui lòng cung cấp startDate và endDate');
            }

            const customerData = await statisticsRepository.getCustomerStats(
                new Date(startDate),
                new Date(endDate)
            );

            return success(req, res, customerData, 200);
        } catch (error) {
            console.error('Error in getCustomers:', error);
            return fail(req, res, 500, 'Lỗi khi lấy thống kê khách hàng');
        }
    },

    // API thống kê theo danh mục
    getCategories: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                return fail(req, res, 400, 'Vui lòng cung cấp startDate và endDate');
            }

            const categoryData = await statisticsRepository.getProductCategoryStats(
                new Date(startDate),
                new Date(endDate)
            );

            return success(req, res, categoryData, 200);
        } catch (error) {
            console.error('Error in getCategories:', error);
            return fail(req, res, 500, 'Lỗi khi lấy thống kê theo danh mục');
        }
    },

    // API thống kê theo thương hiệu
    getBrands: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                return fail(req, res, 400, 'Vui lòng cung cấp startDate và endDate');
            }

            const brandData = await statisticsRepository.getBrandStats(
                new Date(startDate),
                new Date(endDate)
            );

            return success(req, res, brandData, 200);
        } catch (error) {
            console.error('Error in getBrands:', error);
            return fail(req, res, 500, 'Lỗi khi lấy thống kê theo thương hiệu');
        }
    },

    // API thống kê phương thức thanh toán
    getPaymentMethods: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                return fail(req, res, 400, 'Vui lòng cung cấp startDate và endDate');
            }

            const paymentData = await statisticsRepository.getPaymentMethodStats(
                new Date(startDate),
                new Date(endDate)
            );

            return success(req, res, paymentData, 200);
        } catch (error) {
            console.error('Error in getPaymentMethods:', error);
            return fail(req, res, 500, 'Lỗi khi lấy thống kê phương thức thanh toán');
        }
    }
};
