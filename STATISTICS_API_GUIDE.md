# Hướng dẫn sử dụng API Thống kê

## Tổng quan
Hệ thống API thống kê cung cấp các endpoint để lấy thông tin thống kê chi tiết về doanh thu, đơn hàng, khách hàng, sản phẩm và các chỉ số quan trọng khác cho website e-commerce.

## Xác thực
Tất cả các API thống kê yêu cầu xác thực admin. Bạn cần gửi token trong header:
```
Authorization: Bearer <your-admin-token>
```

## Base URL
```
/api/statistics
```

## Danh sách API

### 1. Dashboard Tổng quan
**GET** `/api/statistics/dashboard`

Lấy thống kê tổng quan cho dashboard admin.

**Response:**
```json
{
  "statusCode": 200,
  "message": "Success!",
  "result": {
    "data": {
      "revenue": {
        "today": 1500000,
        "month": 45000000,
        "year": 500000000
      },
      "orders": {
        "total": 1250,
        "today": 15,
        "pending": 8
      },
      "customers": {
        "total": 850,
        "newToday": 3
      },
      "products": {
        "total": 120
      }
    }
  }
}
```

### 2. Thống kê Doanh thu
**GET** `/api/statistics/revenue`

**Query Parameters:**
- `startDate` (required): Ngày bắt đầu (YYYY-MM-DD)
- `endDate` (required): Ngày kết thúc (YYYY-MM-DD)
- `groupBy` (optional): Nhóm theo 'day', 'month', 'year' (default: 'day')

**Example:**
```
GET /api/statistics/revenue?startDate=2024-01-01&endDate=2024-01-31&groupBy=day
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Success!",
  "result": {
    "data": [
      {
        "period": "2024-01-01",
        "total_revenue": "2500000",
        "total_transactions": "25"
      },
      {
        "period": "2024-01-02",
        "total_revenue": "1800000",
        "total_transactions": "18"
      }
    ]
  }
}
```

### 3. So sánh Doanh thu
**GET** `/api/statistics/revenue/comparison`

**Query Parameters:**
- `currentStart` (required): Ngày bắt đầu kỳ hiện tại
- `currentEnd` (required): Ngày kết thúc kỳ hiện tại
- `previousStart` (required): Ngày bắt đầu kỳ trước
- `previousEnd` (required): Ngày kết thúc kỳ trước

**Example:**
```
GET /api/statistics/revenue/comparison?currentStart=2024-02-01&currentEnd=2024-02-29&previousStart=2024-01-01&previousEnd=2024-01-31
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Success!",
  "result": {
    "data": {
      "current": 45000000,
      "previous": 38000000,
      "growth": 18.42
    }
  }
}
```

### 4. Thống kê Đơn hàng
**GET** `/api/statistics/orders`

**Query Parameters:**
- `startDate` (required): Ngày bắt đầu
- `endDate` (required): Ngày kết thúc

**Response:**
```json
{
  "statusCode": 200,
  "message": "Success!",
  "result": {
    "data": [
      {
        "status": "pending",
        "count": "15",
        "total_amount": "12500000"
      },
      {
        "status": "delivered",
        "count": "120",
        "total_amount": "85000000"
      }
    ]
  }
}
```

### 5. Top Sản phẩm Bán chạy
**GET** `/api/statistics/products/top`

**Query Parameters:**
- `startDate` (required): Ngày bắt đầu
- `endDate` (required): Ngày kết thúc
- `limit` (optional): Số lượng sản phẩm (default: 10)

**Response:**
```json
{
  "statusCode": 200,
  "message": "Success!",
  "result": {
    "data": [
      {
        "id": "product-uuid",
        "name": "iPhone 15 Pro",
        "price": 25000000,
        "img": "image-url",
        "brand_name": "Apple",
        "category_name": "Smartphone",
        "sold_quantity": "45",
        "total_revenue": "1125000000"
      }
    ]
  }
}
```

### 6. Thống kê Khách hàng
**GET** `/api/statistics/customers`

**Query Parameters:**
- `startDate` (required): Ngày bắt đầu
- `endDate` (required): Ngày kết thúc

**Response:**
```json
{
  "statusCode": 200,
  "message": "Success!",
  "result": {
    "data": {
      "newCustomers": [
        {
          "date": "2024-01-01",
          "new_customers": "5"
        }
      ],
      "topCustomers": [
        {
          "id": "customer-uuid",
          "name": "Nguyễn Văn A",
          "email": "customer@email.com",
          "phone": "0123456789",
          "total_orders": "8",
          "total_spent": "15000000"
        }
      ]
    }
  }
}
```

### 7. Thống kê theo Danh mục
**GET** `/api/statistics/categories`

**Query Parameters:**
- `startDate` (required): Ngày bắt đầu
- `endDate` (required): Ngày kết thúc

### 8. Thống kê theo Thương hiệu
**GET** `/api/statistics/brands`

**Query Parameters:**
- `startDate` (required): Ngày bắt đầu
- `endDate` (required): Ngày kết thúc

### 9. Thống kê Phương thức Thanh toán
**GET** `/api/statistics/payment-methods`

**Query Parameters:**
- `startDate` (required): Ngày bắt đầu
- `endDate` (required): Ngày kết thúc

## Lỗi thường gặp

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Vui lòng cung cấp startDate và endDate"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Token không hợp lệ"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Lỗi khi lấy thống kê doanh thu"
}
```

## Ghi chú
- Tất cả ngày tháng sử dụng định dạng ISO 8601 (YYYY-MM-DD)
- Doanh thu được tính bằng VND
- Chỉ tính các giao dịch có trạng thái 'completed'
- API hỗ trợ CORS cho frontend
