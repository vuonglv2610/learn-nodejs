# 🚀 Hướng dẫn Tạo Bảng Tự Động - Cách 2

## 📋 Tổng quan

**Cách 2** sử dụng phương pháp:
- ✅ Tắt foreign key checks
- ✅ Setup associations trước
- ✅ Sync tất cả bảng cùng lúc
- ✅ Bật lại foreign key checks
- ✅ Tạo data mẫu tự động

## 🔧 Cách sử dụng

### Bước 1: Đảm bảo XAMPP đang chạy
```bash
# Kiểm tra MySQL service đang chạy
# Mở XAMPP Control Panel → Start MySQL
```

### Bước 2: Tạo database (nếu chưa có)
```sql
-- Trong phpMyAdmin hoặc MySQL command line
CREATE DATABASE nodejs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Bước 3: Khởi động server
```bash
npm run dev
```

## 📊 Quá trình tự động

Khi server khởi động, bạn sẽ thấy log:

```
🚀 Khởi động hệ thống tạo bảng tự động...
📋 Phương pháp: Tắt foreign key checks + Sync tất cả
🔓 Đã tắt foreign key checks
🔗 Đã thiết lập tất cả associations
⏳ Đang tạo tất cả bảng...
🔒 Đã bật lại foreign key checks
🌱 Tạo data mẫu...
✅ Đã tạo roles: 3
✅ Đã tạo categories: 4
✅ Đã tạo brands: 5
✅ Đã tạo vouchers: 2
🎉 Hoàn thành tạo data mẫu!
✅ Kiểm tra kết nối database: OK
🎉 HOÀN THÀNH! Tất cả bảng đã được tạo tự động thành công!
📊 Database sẵn sàng sử dụng với đầy đủ relationships và data mẫu
Example app listening on port 8000
```

## 🗃️ Bảng được tạo

Sau khi hoàn thành, bạn sẽ có **13 bảng**:

1. ✅ **roles** (3 records: admin, staff, customer)
2. ✅ **categories** (4 records: Electronics, Clothing, Books, Sports)
3. ✅ **brands** (5 records: Apple, Samsung, Nike, Adidas, Sony)
4. ✅ **vouchers** (2 records: WELCOME10, SUMMER20)
5. ✅ **users** (empty - sẵn sàng tạo admin)
6. ✅ **customers** (empty - sẵn sàng register)
7. ✅ **products** (empty - sẵn sàng thêm sản phẩm)
8. ✅ **serials** (empty)
9. ✅ **orders** (empty)
10. ✅ **payments** (empty)
11. ✅ **comments** (empty)
12. ✅ **articles** (empty)
13. ✅ **shoppingcart** (empty)

## 🧪 Test API

Sau khi tạo xong, test các endpoint:

```bash
# Test lấy roles
GET http://localhost:8000/api/roles

# Test lấy categories
GET http://localhost:8000/api/categories

# Test lấy brands  
GET http://localhost:8000/api/brands

# Test register customer
POST http://localhost:8000/api/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "123456",
  "confirmPassword": "123456"
}

# Test login
POST http://localhost:8000/api/login
{
  "email": "test@example.com",
  "password": "123456"
}
```

## ⚙️ Cấu hình

### Thay đổi data mẫu
Chỉnh sửa file `src/scripts/seed-data.js` để thêm/sửa data mẫu.

### Tắt tạo data mẫu
Comment dòng trong `src/routers/index.js`:
```javascript
// await seedData();  // Comment để tắt seed data
```

### Thay đổi sync mode
```javascript
await sequelize.sync({ 
  force: false,  // Đổi thành false để không xóa data cũ
  alter: true,   // Thêm alter để cập nhật schema
  logging: true  // Bật để xem SQL queries
});
```

## 🔄 Reset Database

Nếu muốn reset lại từ đầu:

1. **Stop server** (Ctrl+C)
2. **Xóa database:**
```sql
DROP DATABASE nodejs;
CREATE DATABASE nodejs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
3. **Restart server:** `npm run dev`

## ⚠️ Lưu ý

- **`force: true`** sẽ XÓA tất cả data cũ
- **Chỉ dùng trong development** - không dùng production
- **Backup data** trước khi chạy lại
- **Foreign key checks** được tự động khôi phục dù có lỗi

## 🎯 Ưu điểm Cách 2

- ✅ **Nhanh** - sync tất cả cùng lúc
- ✅ **Tự động** - không cần can thiệp thủ công
- ✅ **An toàn** - có error handling
- ✅ **Đầy đủ** - bao gồm data mẫu
- ✅ **Relationships** - associations hoạt động ngay

---

🎉 **Database của bạn đã sẵn sàng để phát triển API!**
