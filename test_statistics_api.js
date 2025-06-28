// File test đơn giản để kiểm tra API thống kê
// Chạy: node test_statistics_api.js

const axios = require('axios');

// Cấu hình
const BASE_URL = 'http://localhost:3000'; // Thay đổi port nếu cần
const API_BASE = `${BASE_URL}/api/statistics`;

// Token admin - thay bằng token thực tế của bạn
const ADMIN_TOKEN = 'your-admin-token-here';

const headers = {
    'Authorization': `Bearer ${ADMIN_TOKEN}`,
    'Content-Type': 'application/json'
};

// Hàm test các API
async function testStatisticsAPI() {
    console.log('🚀 Bắt đầu test API thống kê...\n');

    try {
        // Test 1: Dashboard
        console.log('📊 Test 1: Dashboard tổng quan');
        const dashboardResponse = await axios.get(`${API_BASE}/dashboard`, { headers });
        console.log('✅ Dashboard API hoạt động:', dashboardResponse.data);
        console.log('');

        // Test 2: Thống kê doanh thu
        console.log('💰 Test 2: Thống kê doanh thu');
        const revenueResponse = await axios.get(`${API_BASE}/revenue`, {
            headers,
            params: {
                startDate: '2024-01-01',
                endDate: '2024-12-31',
                groupBy: 'month'
            }
        });
        console.log('✅ Revenue API hoạt động:', revenueResponse.data);
        console.log('');

        // Test 3: So sánh doanh thu
        console.log('📈 Test 3: So sánh doanh thu');
        const comparisonResponse = await axios.get(`${API_BASE}/revenue/comparison`, {
            headers,
            params: {
                currentStart: '2024-02-01',
                currentEnd: '2024-02-29',
                previousStart: '2024-01-01',
                previousEnd: '2024-01-31'
            }
        });
        console.log('✅ Revenue Comparison API hoạt động:', comparisonResponse.data);
        console.log('');

        // Test 4: Thống kê đơn hàng
        console.log('📦 Test 4: Thống kê đơn hàng');
        const ordersResponse = await axios.get(`${API_BASE}/orders`, {
            headers,
            params: {
                startDate: '2024-01-01',
                endDate: '2024-12-31'
            }
        });
        console.log('✅ Orders API hoạt động:', ordersResponse.data);
        console.log('');

        // Test 5: Top sản phẩm bán chạy
        console.log('🏆 Test 5: Top sản phẩm bán chạy');
        const topProductsResponse = await axios.get(`${API_BASE}/products/top`, {
            headers,
            params: {
                startDate: '2024-01-01',
                endDate: '2024-12-31',
                limit: 5
            }
        });
        console.log('✅ Top Products API hoạt động:', topProductsResponse.data);
        console.log('');

        // Test 6: Thống kê khách hàng
        console.log('👥 Test 6: Thống kê khách hàng');
        const customersResponse = await axios.get(`${API_BASE}/customers`, {
            headers,
            params: {
                startDate: '2024-01-01',
                endDate: '2024-12-31'
            }
        });
        console.log('✅ Customers API hoạt động:', customersResponse.data);
        console.log('');

        // Test 7: Thống kê theo danh mục
        console.log('📂 Test 7: Thống kê theo danh mục');
        const categoriesResponse = await axios.get(`${API_BASE}/categories`, {
            headers,
            params: {
                startDate: '2024-01-01',
                endDate: '2024-12-31'
            }
        });
        console.log('✅ Categories API hoạt động:', categoriesResponse.data);
        console.log('');

        // Test 8: Thống kê theo thương hiệu
        console.log('🏷️ Test 8: Thống kê theo thương hiệu');
        const brandsResponse = await axios.get(`${API_BASE}/brands`, {
            headers,
            params: {
                startDate: '2024-01-01',
                endDate: '2024-12-31'
            }
        });
        console.log('✅ Brands API hoạt động:', brandsResponse.data);
        console.log('');

        // Test 9: Thống kê phương thức thanh toán
        console.log('💳 Test 9: Thống kê phương thức thanh toán');
        const paymentMethodsResponse = await axios.get(`${API_BASE}/payment-methods`, {
            headers,
            params: {
                startDate: '2024-01-01',
                endDate: '2024-12-31'
            }
        });
        console.log('✅ Payment Methods API hoạt động:', paymentMethodsResponse.data);
        console.log('');

        console.log('🎉 Tất cả API thống kê đã được test thành công!');

    } catch (error) {
        console.error('❌ Lỗi khi test API:', error.response?.data || error.message);
        
        if (error.response?.status === 401) {
            console.log('\n💡 Gợi ý: Vui lòng cập nhật ADMIN_TOKEN trong file test với token admin hợp lệ');
        }
        
        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Gợi ý: Đảm bảo server đang chạy trên port 3000');
        }
    }
}

// Chạy test
testStatisticsAPI();
