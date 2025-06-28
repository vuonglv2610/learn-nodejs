# Hệ thống API Thống kê E-commerce

## 📋 Tổng quan

Hệ thống API thống kê được thiết kế để cung cấp các thông tin chi tiết về hoạt động kinh doanh của website e-commerce, bao gồm:

- 📊 **Dashboard tổng quan**: Các chỉ số KPI quan trọng
- 💰 **Thống kê doanh thu**: Theo ngày/tháng/năm, so sánh kỳ trước
- 📦 **Thống kê đơn hàng**: Trạng thái, xu hướng đặt hàng
- 👥 **Thống kê khách hàng**: Khách hàng mới, top khách hàng VIP
- 🏆 **Sản phẩm bán chạy**: Top sản phẩm theo doanh thu/số lượng
- 📂 **Phân tích danh mục**: Hiệu suất theo từng danh mục sản phẩm
- 🏷️ **Phân tích thương hiệu**: Hiệu suất theo từng thương hiệu
- 💳 **Phương thức thanh toán**: Thống kê theo từng phương thức

## 🏗️ Kiến trúc

### Files đã tạo:
```
src/
├── controllers/
│   └── statistics.controller.js     # Controller xử lý logic API
├── repositories/
│   └── statistics.repository.js     # Repository xử lý database queries
├── routers/
│   └── statistics.route.js          # Định nghĩa routes
└── routers/
    └── index.js                     # Đã cập nhật để include statistics routes
```

### Tài liệu:
```
├── STATISTICS_API_GUIDE.md          # Hướng dẫn sử dụng API chi tiết
├── test_statistics_api.js           # File test API
└── README_STATISTICS.md             # File này
```

## 🚀 Cách sử dụng

### 1. Khởi động server
```bash
npm run dev
# hoặc
npm start
```

### 2. Test API
```bash
# Cập nhật token admin trong file test
node test_statistics_api.js
```

### 3. Sử dụng API

**Base URL:** `/api/statistics`

**Xác thực:** Tất cả API yêu cầu token admin trong header:
```
Authorization: Bearer <admin-token>
```

## 📊 Các API chính

### Dashboard Tổng quan
```http
GET /api/statistics/dashboard
```
Trả về các chỉ số KPI quan trọng: doanh thu hôm nay/tháng/năm, số đơn hàng, khách hàng mới, v.v.

### Thống kê Doanh thu
```http
GET /api/statistics/revenue?startDate=2024-01-01&endDate=2024-12-31&groupBy=month
```
Thống kê doanh thu theo thời gian với khả năng nhóm theo ngày/tháng/năm.

### So sánh Doanh thu
```http
GET /api/statistics/revenue/comparison?currentStart=2024-02-01&currentEnd=2024-02-29&previousStart=2024-01-01&previousEnd=2024-01-31
```
So sánh doanh thu giữa 2 kỳ và tính % tăng trưởng.

### Top Sản phẩm Bán chạy
```http
GET /api/statistics/products/top?startDate=2024-01-01&endDate=2024-12-31&limit=10
```
Danh sách sản phẩm bán chạy nhất theo doanh thu và số lượng.

## 🔧 Cấu hình Database

API sử dụng các bảng hiện có:
- `orders` - Đơn hàng
- `payments` - Thanh toán
- `products` - Sản phẩm
- `customers` - Khách hàng
- `categories` - Danh mục
- `brands` - Thương hiệu
- `serials` - Serial sản phẩm

## 📈 Tính năng nổi bật

### 1. Hiệu suất cao
- Sử dụng raw SQL queries cho các truy vấn phức tạp
- Tối ưu hóa với Sequelize ORM
- Hỗ trợ pagination và filtering

### 2. Bảo mật
- Xác thực admin bắt buộc
- Validation input parameters
- Error handling toàn diện

### 3. Linh hoạt
- Hỗ trợ multiple time ranges
- Grouping theo ngày/tháng/năm
- Customizable limits và filters

## 🧪 Testing

### Chạy test tự động:
```bash
node test_statistics_api.js
```

### Test thủ công với Postman/Insomnia:
1. Import collection từ `STATISTICS_API_GUIDE.md`
2. Cập nhật token admin
3. Test từng endpoint

## 🔍 Troubleshooting

### Lỗi 401 Unauthorized
- Kiểm tra token admin có hợp lệ không
- Đảm bảo header Authorization đúng format

### Lỗi 400 Bad Request
- Kiểm tra required parameters (startDate, endDate)
- Đảm bảo format ngày đúng (YYYY-MM-DD)

### Lỗi 500 Internal Server Error
- Kiểm tra kết nối database
- Xem logs server để debug

## 📝 Ghi chú quan trọng

1. **Dữ liệu thống kê**: Chỉ tính các payment có status 'completed'
2. **Timezone**: Sử dụng timezone của server
3. **Performance**: Với dataset lớn, nên sử dụng pagination
4. **Caching**: Có thể implement Redis cache cho các query thường xuyên

## 🔄 Cập nhật tiếp theo

Các tính năng có thể mở rộng:
- [ ] Export báo cáo Excel/PDF
- [ ] Real-time statistics với WebSocket
- [ ] Advanced filtering và search
- [ ] Caching với Redis
- [ ] Rate limiting
- [ ] Audit logs cho admin actions

## 📞 Hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra logs server
2. Xem file `STATISTICS_API_GUIDE.md` để biết chi tiết API
3. Chạy file test để verify functionality
