# Orders With Details API - Response Format

## API Endpoints

### 1. GET `/api/orders/with-details` - Lấy danh sách orders với details

**Response Format:**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": "ecbc9113-f6bb-47aa-8f82-ecc513758263",
      "customerId": "b308302a-7ae2-4b74-8a07-b6259a8ef113",
      "order_date": "2024-12-19T10:30:45.000Z",
      "status": "pending",
      "total_amount": 600000,
      "createdAt": "2024-12-19T10:30:45.000Z",
      "updatedAt": "2024-12-19T10:30:45.000Z",
      "deletedAt": null,
      "customer": {
        "id": "b308302a-7ae2-4b74-8a07-b6259a8ef113",
        "name": "Vuong Le Van",
        "email": "customer1@gmail.com",
        "phone": "0123456789"
      },
      "orderDetails": [
        {
          "id": "detail-uuid-1",
          "orderId": "ecbc9113-f6bb-47aa-8f82-ecc513758263",
          "productId": "06299207-7e57-4417-8095-bc750e8eff9c",
          "quantity": 2,
          "unit_price": 200000,
          "total_price": 400000,
          "serial_numbers": "[\"SN001\", \"SN002\"]",
          "createdAt": "2024-12-19T10:30:45.000Z",
          "updatedAt": "2024-12-19T10:30:45.000Z",
          "deletedAt": null,
          "product": {
            "id": "06299207-7e57-4417-8095-bc750e8eff9c",
            "name": "Thẻ nhớ Micro Sandisk Ultra 32GB",
            "sku": "SANDISK-32GB",
            "price": 200000,
            "img": "sandisk-32gb.jpg"
          }
        },
        {
          "id": "detail-uuid-2",
          "orderId": "ecbc9113-f6bb-47aa-8f82-ecc513758263",
          "productId": "06299207-7e57-4417-8095-bc750e8eff9c",
          "quantity": 1,
          "unit_price": 200000,
          "total_price": 200000,
          "serial_numbers": "[\"SN003\"]",
          "createdAt": "2024-12-19T10:30:45.000Z",
          "updatedAt": "2024-12-19T10:30:45.000Z",
          "deletedAt": null,
          "product": {
            "id": "06299207-7e57-4417-8095-bc750e8eff9c",
            "name": "Thẻ nhớ Micro Sandisk Ultra 32GB",
            "sku": "SANDISK-32GB",
            "price": 200000,
            "img": "sandisk-32gb.jpg"
          }
        }
      ]
    }
  ]
}
```

### 2. GET `/api/orders/with-details/:id` - Lấy order với details theo ID

**Response Format:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "ecbc9113-f6bb-47aa-8f82-ecc513758263",
    "customerId": "b308302a-7ae2-4b74-8a07-b6259a8ef113",
    "order_date": "2024-12-19T10:30:45.000Z",
    "status": "pending",
    "total_amount": 600000,
    "createdAt": "2024-12-19T10:30:45.000Z",
    "updatedAt": "2024-12-19T10:30:45.000Z",
    "deletedAt": null,
    "customer": {
      "id": "b308302a-7ae2-4b74-8a07-b6259a8ef113",
      "name": "Vuong Le Van",
      "email": "customer1@gmail.com",
      "phone": "0123456789"
    },
    "orderDetails": [
      {
        "id": "detail-uuid-1",
        "orderId": "ecbc9113-f6bb-47aa-8f82-ecc513758263",
        "productId": "06299207-7e57-4417-8095-bc750e8eff9c",
        "quantity": 2,
        "unit_price": 200000,
        "total_price": 400000,
        "serial_numbers": "[\"SN001\", \"SN002\"]",
        "createdAt": "2024-12-19T10:30:45.000Z",
        "updatedAt": "2024-12-19T10:30:45.000Z",
        "deletedAt": null,
        "product": {
          "id": "06299207-7e57-4417-8095-bc750e8eff9c",
          "name": "Thẻ nhớ Micro Sandisk Ultra 32GB",
          "sku": "SANDISK-32GB",
          "price": 200000,
          "img": "sandisk-32gb.jpg"
        }
      }
    ]
  }
}
```

### 3. POST `/api/orders/with-details` - Tạo order với details

**Request Body:**
```json
{
  "customerId": "b308302a-7ae2-4b74-8a07-b6259a8ef113",
  "orderData": {
    "status": "pending"
  },
  "orderItems": [
    {
      "productId": "06299207-7e57-4417-8095-bc750e8eff9c",
      "quantity": 2,
      "unit_price": 200000,
      "serial_numbers": "[\"SN001\", \"SN002\"]"
    }
  ]
}
```

**Response Format:** (Same as GET single order)

### 4. PUT `/api/orders/with-details/:id` - Cập nhật order với details

**Request Body:**
```json
{
  "orderData": {
    "status": "confirmed"
  },
  "orderItems": [
    {
      "productId": "06299207-7e57-4417-8095-bc750e8eff9c",
      "quantity": 3,
      "unit_price": 200000
    }
  ]
}
```

**Response Format:** (Same as GET single order)

### 5. DELETE `/api/orders/with-details/:id` - Xóa order với details

**Response Format:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "message": "Order and order details deleted successfully"
  }
}
```

## Data Structure Explanation

### Order Object
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Order ID |
| customerId | UUID | Customer ID |
| order_date | DateTime | Order date |
| status | Enum | Order status: 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled' |
| total_amount | Float | Total amount of order |
| createdAt | DateTime | Created timestamp |
| updatedAt | DateTime | Updated timestamp |
| deletedAt | DateTime/null | Deleted timestamp (soft delete) |

### Customer Object (nested in Order)
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Customer ID |
| name | String | Customer name |
| email | String | Customer email |
| phone | String | Customer phone |

### OrderDetail Object (array in Order)
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Order detail ID |
| orderId | UUID | Order ID |
| productId | UUID | Product ID |
| quantity | Integer | Quantity ordered |
| unit_price | Float | Unit price at time of order |
| total_price | Float | Total price (quantity × unit_price) |
| serial_numbers | String/null | JSON string of serial numbers |
| createdAt | DateTime | Created timestamp |
| updatedAt | DateTime | Updated timestamp |
| deletedAt | DateTime/null | Deleted timestamp (soft delete) |

### Product Object (nested in OrderDetail)
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Product ID |
| name | String | Product name |
| sku | String | Product SKU |
| price | Float | Current product price |
| img | String | Product image filename |

## Query Parameters

### GET `/api/orders/with-details`
- `customerId`: Filter by customer ID
- `status`: Filter by order status

Example: `/api/orders/with-details?customerId=b308302a-7ae2-4b74-8a07-b6259a8ef113&status=pending`

## Error Response Format

```json
{
  "success": false,
  "message": "Error message here",
  "data": null
}
```

Common error codes:
- 400: Bad Request (validation errors)
- 404: Not Found (order/customer/product not found)
- 500: Internal Server Error
