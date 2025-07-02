# OrderDetail API Documentation

## Tổng quan

OrderDetail là chức năng quản lý chi tiết đơn hàng, lưu trữ thông tin về từng sản phẩm trong một đơn hàng bao gồm số lượng, giá đơn vị, tổng tiền và serial numbers.

## Cấu trúc Database

### Bảng `order_details`

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| id | UUID | Primary key |
| orderId | UUID | Foreign key đến bảng orders |
| productId | UUID | Foreign key đến bảng products |
| quantity | INTEGER | Số lượng sản phẩm (> 0) |
| unit_price | FLOAT | Giá đơn vị (>= 0) |
| total_price | FLOAT | Tổng tiền (tự động tính) |
| serial_numbers | TEXT | JSON array chứa serial numbers |
| createdAt | DATETIME | Thời gian tạo |
| updatedAt | DATETIME | Thời gian cập nhật |
| deletedAt | DATETIME | Thời gian xóa (soft delete) |

## API Endpoints

### 1. OrderDetail Routes (`/api/order-details`)

#### GET `/api/order-details`
Lấy danh sách order details với filter

**Query Parameters:**
- `orderId`: Filter theo order ID
- `productId`: Filter theo product ID

**Response:**
```json
{
  "success": true,
  "message": "Order details retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "orderId": "uuid",
      "productId": "uuid",
      "quantity": 2,
      "unit_price": 100000,
      "total_price": 200000,
      "serial_numbers": "[\"SN001\", \"SN002\"]",
      "product": {
        "id": "uuid",
        "name": "Product Name",
        "sku": "SKU001",
        "price": 100000,
        "img": "image.jpg"
      },
      "order": {
        "id": "uuid",
        "order_date": "2024-01-01T00:00:00.000Z",
        "status": "pending",
        "total_amount": 300000
      }
    }
  ]
}
```

#### GET `/api/order-details/:id`
Lấy order detail theo ID

#### GET `/api/order-details/order/:orderId`
Lấy tất cả order details của một order

#### POST `/api/order-details`
Tạo order detail mới

**Request Body:**
```json
{
  "orderId": "uuid",
  "productId": "uuid",
  "quantity": 2,
  "unit_price": 100000,
  "serial_numbers": "[\"SN001\", \"SN002\"]"
}
```

#### POST `/api/order-details/bulk`
Tạo nhiều order details cùng lúc

**Request Body:**
```json
{
  "orderDetails": [
    {
      "orderId": "uuid",
      "productId": "uuid1",
      "quantity": 2,
      "unit_price": 100000
    },
    {
      "orderId": "uuid",
      "productId": "uuid2",
      "quantity": 1,
      "unit_price": 200000
    }
  ]
}
```

#### PUT `/api/order-details/:id`
Cập nhật order detail

#### DELETE `/api/order-details/:id`
Xóa order detail

### 2. Enhanced Order Routes (`/api/orders`)

#### GET `/api/orders/with-details`
Lấy danh sách orders cùng với order details

**Query Parameters:**
- `customerId`: Filter theo customer ID
- `status`: Filter theo status

#### GET `/api/orders/with-details/:id`
Lấy order cùng với order details theo ID

#### POST `/api/orders/with-details`
Tạo order mới cùng với order details

**Request Body:**
```json
{
  "customerId": "uuid",
  "orderData": {
    "status": "pending"
  },
  "orderItems": [
    {
      "productId": "uuid1",
      "quantity": 2,
      "unit_price": 100000,
      "serial_numbers": "[\"SN001\", \"SN002\"]"
    },
    {
      "productId": "uuid2",
      "quantity": 1,
      "unit_price": 200000
    }
  ]
}
```

#### PUT `/api/orders/with-details/:id`
Cập nhật order cùng với order details

#### DELETE `/api/orders/with-details/:id`
Xóa order cùng với order details

## Sử dụng OrderService

### Tạo order với details
```javascript
const OrderService = require('../services/orderService');

const orderData = { status: 'pending' };
const orderItems = [
  {
    productId: 'product-uuid',
    quantity: 2,
    unit_price: 100000,
    serial_numbers: '["SN001", "SN002"]'
  }
];
const customerId = 'customer-uuid';

const result = await OrderService.createOrderWithDetails(orderData, orderItems, customerId);
```

### Lấy order với details
```javascript
const order = await OrderService.getOrderWithDetails(orderId);
```

### Cập nhật order với details
```javascript
const updatedOrder = await OrderService.updateOrderWithDetails(
  orderId, 
  { status: 'confirmed' }, 
  newOrderItems
);
```

## Validation Rules

1. **quantity**: Phải > 0
2. **unit_price**: Phải >= 0
3. **orderId**: Bắt buộc, phải tồn tại trong bảng orders
4. **productId**: Bắt buộc, phải tồn tại trong bảng products
5. **total_price**: Tự động tính = quantity × unit_price

## Features

### 1. Automatic Calculation
- `total_price` được tự động tính toán từ `quantity` × `unit_price`
- Sử dụng Sequelize hooks (beforeSave)

### 2. Transaction Support
- Tất cả operations trong OrderService sử dụng database transactions
- Đảm bảo data consistency khi tạo/cập nhật order và order details

### 3. Soft Delete
- Sử dụng paranoid mode của Sequelize
- Records được đánh dấu deleted thay vì xóa vật lý

### 4. Associations
- OrderDetail belongsTo Order
- OrderDetail belongsTo Product
- Order hasMany OrderDetails
- Product hasMany OrderDetails

### 5. Serial Numbers Support
- Lưu trữ serial numbers dưới dạng JSON string
- Hỗ trợ tracking serial numbers cho từng sản phẩm

## Setup

### 1. Khởi động server
Server sẽ tự động tạo bảng `order_details` và associations khi khởi động.

### 2. Tạo bảng thủ công (nếu cần)
```bash
node src/scripts/create-tables.js
```

### 3. Kiểm tra bảng đã tạo
Kiểm tra trong database xem bảng `order_details` đã được tạo với đầy đủ columns.

## Error Handling

- Validation errors: 400 Bad Request
- Not found errors: 404 Not Found
- Database errors: 500 Internal Server Error
- Transaction rollback tự động khi có lỗi

## Best Practices

1. **Luôn sử dụng transactions** khi tạo/cập nhật order và order details
2. **Validate dữ liệu** trước khi gọi API
3. **Sử dụng OrderService** thay vì gọi trực tiếp repository
4. **Kiểm tra tồn kho** trước khi tạo order details
5. **Log errors** để debug và monitoring
