# Email Templates - HVStore

Hệ thống email templates chuyên nghiệp cho HVStore với thiết kế responsive và đẹp mắt.

## 📧 Các Template Có Sẵn

### 1. Welcome Email (`welcome.html`)
- **Mục đích**: Gửi khi khách hàng đăng ký tài khoản mới
- **Trigger**: Sau khi đăng ký thành công hoặc đăng nhập bằng Google
- **Variables**:
  - `{{customerName}}`: Tên khách hàng
  - `{{currentYear}}`: Năm hiện tại
  - `{{supportEmail}}`: Email hỗ trợ
  - `{{websiteUrl}}`: URL website

### 2. Order Confirmation (`order-confirmation.html`)
- **Mục đích**: Xác nhận đơn hàng đã được tạo thành công
- **Trigger**: Sau khi tạo đơn hàng từ giỏ hàng
- **Variables**:
  - `{{customerName}}`: Tên khách hàng
  - `{{orderId}}`: Mã đơn hàng
  - `{{orderDate}}`: Ngày đặt hàng
  - `{{totalAmount}}`: Tổng tiền (đã format VND)
  - `{{orderItems}}`: HTML table các sản phẩm
  - `{{trackingUrl}}`: Link theo dõi đơn hàng
  - `{{currentYear}}`: Năm hiện tại
  - `{{supportEmail}}`: Email hỗ trợ

### 3. Payment Success (`payment-success.html`)
- **Mục đích**: Thông báo thanh toán thành công
- **Trigger**: Khi VNPay callback với trạng thái thành công
- **Variables**:
  - `{{customerName}}`: Tên khách hàng
  - `{{orderId}}`: Mã đơn hàng
  - `{{paymentId}}`: Mã giao dịch
  - `{{paymentDate}}`: Ngày thanh toán
  - `{{paymentMethod}}`: Phương thức thanh toán
  - `{{amount}}`: Số tiền (đã format VND)
  - `{{orderUrl}}`: Link xem chi tiết đơn hàng
  - `{{currentYear}}`: Năm hiện tại
  - `{{supportEmail}}`: Email hỗ trợ

### 4. Order Status Update (`order-status.html`)
- **Mục đích**: Thông báo thay đổi trạng thái đơn hàng
- **Trigger**: Khi admin cập nhật trạng thái đơn hàng
- **Variables**:
  - `{{customerName}}`: Tên khách hàng
  - `{{orderId}}`: Mã đơn hàng
  - `{{oldStatus}}`: Trạng thái cũ
  - `{{newStatus}}`: Trạng thái mới
  - `{{statusMessage}}`: Thông điệp mô tả trạng thái
  - `{{updateDate}}`: Ngày cập nhật
  - `{{orderUrl}}`: Link xem chi tiết đơn hàng
  - `{{currentYear}}`: Năm hiện tại
  - `{{supportEmail}}`: Email hỗ trợ

## 🎨 Thiết Kế Features

### Responsive Design
- Tối ưu cho cả desktop và mobile
- Breakpoint tại 600px
- Layout linh hoạt với flexbox

### Visual Elements
- Gradient backgrounds đẹp mắt
- Icons emoji phù hợp với nội dung
- Animation CSS nhẹ nhàng
- Color scheme nhất quán

### Typography
- Font family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- Hierarchy rõ ràng với các cấp độ heading
- Line-height tối ưu cho khả năng đọc

### Components
- Header với gradient và icon
- Info boxes với border-left accent
- Tables với zebra striping
- CTA buttons với hover effects
- Footer với links và copyright

## 🔧 Cách Sử Dụng

### Import Email Service
```javascript
const { 
  sendWelcomeEmail, 
  sendOrderConfirmationEmail, 
  sendPaymentSuccessEmail, 
  sendOrderStatusEmail 
} = require('../services/emailService');
```

### Gửi Welcome Email
```javascript
await sendWelcomeEmail('customer@example.com', 'Nguyễn Văn A');
```

### Gửi Order Confirmation
```javascript
const orderData = {
  customerName: 'Nguyễn Văn A',
  orderId: 'ORD-12345',
  orderDate: new Date(),
  totalAmount: 2500000,
  items: [
    {
      productName: 'iPhone 15',
      quantity: 1,
      unitPrice: 2500000,
      totalPrice: 2500000
    }
  ]
};

await sendOrderConfirmationEmail('customer@example.com', orderData);
```

### Gửi Payment Success
```javascript
const paymentData = {
  customerName: 'Nguyễn Văn A',
  orderId: 'ORD-12345',
  paymentId: 'PAY-67890',
  paymentDate: new Date(),
  paymentMethod: 'vnpay',
  amount: 2500000
};

await sendPaymentSuccessEmail('customer@example.com', paymentData);
```

### Gửi Order Status Update
```javascript
const statusData = {
  customerName: 'Nguyễn Văn A',
  orderId: 'ORD-12345',
  oldStatus: 'confirmed',
  newStatus: 'shipped'
};

await sendOrderStatusEmail('customer@example.com', statusData);
```

## 🧪 Testing

Chạy test script để kiểm tra tất cả templates:

```bash
node test-email-templates.js
```

## 📝 Customization

### Thay đổi màu sắc
Tìm và thay thế các gradient CSS:
- Primary: `#667eea` → `#764ba2`
- Success: `#27ae60` → `#2ecc71`
- Info: `#3498db` → `#2980b9`

### Thêm template mới
1. Tạo file HTML trong thư mục `src/templates/`
2. Thêm method trong `EmailService` class
3. Export method trong module.exports

### Thay đổi layout
Chỉnh sửa CSS trong `<style>` tag của mỗi template.

## 🔒 Security Notes

- Templates không chứa JavaScript
- Tất cả variables được escape tự động
- Chỉ sử dụng inline CSS để tương thích email clients
- Không sử dụng external resources

## 📱 Email Client Compatibility

Templates được test và tương thích với:
- Gmail (Web, Mobile)
- Outlook (2016+, Web)
- Apple Mail
- Yahoo Mail
- Thunderbird

## 🌍 Internationalization

Hiện tại templates chỉ hỗ trợ tiếng Việt. Để thêm ngôn ngữ khác:
1. Tạo thư mục con theo mã ngôn ngữ (vd: `en/`, `ja/`)
2. Copy và dịch templates
3. Thêm logic chọn ngôn ngữ trong EmailService
