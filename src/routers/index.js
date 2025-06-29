const productRoute = require('./product.route');
const categoryRoute = require('./category.route');
const userRoute = require('./user.route');
const authRoute = require('./auth.route');
const shoppingCartRoute = require('./shoppingcart.route');
const roleRoute = require('./role.route');
const customerRoute = require('./customer.route');
const profileRoute = require('./profile.route');
const serialRoute = require('./serial.route');
const orderRoute = require('./order.route');
const brandRoute = require('./brand.route');
const voucherRoute = require('./voucher.route');
const commentRoute = require('./comment.route');
const paymentRoute = require('./payment.route');
const statisticsRoute = require('./statistics.route');
const articleRoute = require('./article.route');
const setupAssociations = require('./../models/associations');
const sequelize = require('./../models/db');
const { authMiddleware } = require('../middleware/auth.middleware');

// Import config
const dbConfig = require('../config/database-mode');

// Cách 2: Tạo tất cả bảng tự động với tắt foreign key checks
async function autoCreateAllTables() {
  try {
    console.log('� Khởi động hệ thống tạo bảng tự động...');
    console.log(`📋 Chế độ: ${dbConfig.CURRENT_MODE.toUpperCase()}`);

    // Kiểm tra kết nối trước
    console.log('🔌 Kiểm tra kết nối database...');
    console.log(`📍 Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    console.log(`🗃️  Database: ${process.env.DB_NAME}`);
    console.log(`👤 User: ${process.env.DB_USER}`);

    await sequelize.authenticate();
    console.log('✅ Kết nối database thành công!');

    // Bước 1: Tắt foreign key checks để tránh lỗi constraint
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    console.log('🔓 Đã tắt foreign key checks');

    // Bước 2: Setup associations trước khi sync
    setupAssociations();
    console.log('🔗 Đã thiết lập tất cả associations');

    // Bước 3: Kiểm tra và tạo bảng nếu cần
    console.log('📋 Kiểm tra bảng hiện có...');

    // Kiểm tra xem đã có bảng chưa
    const [tables] = await sequelize.query("SHOW TABLES");
    const hasExistingTables = tables.length > 0;

    if (hasExistingTables) {
      console.log(`✅ Đã có ${tables.length} bảng - Chỉ sync schema`);
      await sequelize.sync({
        alter: true,    // Cập nhật schema nếu có thay đổi
        logging: false
      });
    } else {
      console.log('⏳ Chưa có bảng - Tạo mới tất cả...');
      await sequelize.sync({
        force: true,    // Tạo mới tất cả bảng
        logging: false
      });
    }

    // Bước 4: Bật lại foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('🔒 Đã bật lại foreign key checks');

    // Bước 5: Tạo data mẫu (chỉ khi tạo bảng mới)
    if (!hasExistingTables) {
      console.log('🌱 Tạo data mẫu...');
      const seedData = require('../scripts/seed-data');
      await seedData();
    } else {
      console.log('📊 Bỏ qua tạo data mẫu - đã có bảng');
    }

    // Bước 6: Kiểm tra kết nối
    await sequelize.authenticate();
    console.log('✅ Kiểm tra kết nối database: OK');

    console.log('🎉 HOÀN THÀNH! Tất cả bảng đã được tạo tự động thành công!');
    console.log('📊 Database sẵn sàng sử dụng với đầy đủ relationships và data mẫu');

  } catch (error) {
    console.error('❌ LỖI khi tạo bảng tự động:', error.message);

    if (error.name === 'SequelizeConnectionRefusedError') {
      console.error('� KHÔNG THỂ KẾT NỐI DATABASE!');
      console.error('📋 Hướng dẫn khắc phục:');
      console.error('   1. ✅ Kiểm tra XAMPP Control Panel');
      console.error('   2. ✅ Start MySQL service (phải màu xanh)');
      console.error('   3. ✅ Kiểm tra port 3306 không bị block');
      console.error('   4. ✅ Tạo database "nodejs" trong phpMyAdmin');
      console.error('   5. 🔄 Restart server sau khi fix');
      console.error('');
      console.error('🌐 phpMyAdmin: http://localhost/phpmyadmin');
      console.error('⚙️  XAMPP Control: Mở XAMPP Control Panel');
    } else {
      console.error('�🔍 Chi tiết lỗi:', error);
    }

    // Cleanup: Đảm bảo bật lại foreign key checks dù có lỗi
    try {
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
      console.log('🔧 Đã khôi phục foreign key checks');
    } catch (cleanupError) {
      // Ignore cleanup error khi không kết nối được
    }

    console.error('⏸️  Server sẽ tiếp tục chạy ở chế độ NO-DATABASE');
    console.error('🔄 Hãy fix database và restart server!');
  }
}

// Chạy tạo bảng tự động
autoCreateAllTables();

const routesArray = [
  { path: '/api/products', route: productRoute },
  { path: '/api/categories', route: categoryRoute },
  { path: '/api/users', authMiddleware, route: userRoute },
  { path: '/api/customers', route: customerRoute },
  { path: '/api/shoppingcart', authMiddleware, route: shoppingCartRoute },
  { path: '/api', route: authRoute },
  { path: '/api/roles', route: roleRoute },
  { path: '/api/profile', authMiddleware, route: profileRoute },
  { path: '/api/serials', route: serialRoute },
  { path: '/api/orders', route: orderRoute },
  { path: '/api/brands', route: brandRoute },
  { path: '/api/vouchers', route: voucherRoute },
  { path: '/api/comments', route: commentRoute },
  { path: '/api/payments', authMiddleware, route: paymentRoute },
  { path: '/api/statistics', authMiddleware, route: statisticsRoute },
  { path: '/api/articles', route: articleRoute },
];

function routes(app) {
  routesArray.forEach((route) => {
    app.use(route.path, route.route);
  });
}

module.exports = routes;
