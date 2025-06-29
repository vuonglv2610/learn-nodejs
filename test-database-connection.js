/**
 * Script để test kết nối database
 * Chạy: node test-database-connection.js
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('🔍 KIỂM TRA KẾT NỐI DATABASE');
  console.log('================================');
  
  // Hiển thị cấu hình
  console.log('📋 Cấu hình hiện tại:');
  console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`   Port: ${process.env.DB_PORT || '3306'}`);
  console.log(`   User: ${process.env.DB_USER || 'root'}`);
  console.log(`   Password: ${process.env.DB_PASSWORD ? '***' : '(empty)'}`);
  console.log(`   Database: ${process.env.DB_NAME || 'nodejs'}`);
  console.log('');

  try {
    // Test 1: Kết nối đến MySQL server (không cần database)
    console.log('🔌 Test 1: Kết nối MySQL server...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });
    
    console.log('✅ Kết nối MySQL server: THÀNH CÔNG');
    
    // Test 2: Kiểm tra database có tồn tại không
    console.log('🗃️  Test 2: Kiểm tra database...');
    const [databases] = await connection.execute('SHOW DATABASES');
    const dbExists = databases.some(db => db.Database === (process.env.DB_NAME || 'nodejs'));
    
    if (dbExists) {
      console.log('✅ Database "nodejs": TỒN TẠI');
      
      // Test 3: Kết nối đến database cụ thể
      await connection.execute(`USE ${process.env.DB_NAME || 'nodejs'}`);
      console.log('✅ Kết nối database "nodejs": THÀNH CÔNG');
      
      // Test 4: Kiểm tra bảng
      const [tables] = await connection.execute('SHOW TABLES');
      console.log(`📊 Số bảng hiện có: ${tables.length}`);
      if (tables.length > 0) {
        console.log('📋 Danh sách bảng:');
        tables.forEach(table => {
          console.log(`   - ${Object.values(table)[0]}`);
        });
      }
      
    } else {
      console.log('❌ Database "nodejs": KHÔNG TỒN TẠI');
      console.log('💡 Tạo database:');
      console.log('   1. Mở phpMyAdmin: http://localhost/phpmyadmin');
      console.log('   2. Click "New" → Nhập "nodejs" → Click "Create"');
      console.log('   3. Hoặc chạy SQL: CREATE DATABASE nodejs;');
    }
    
    await connection.end();
    
    console.log('');
    console.log('🎉 KIỂM TRA HOÀN TẤT!');
    
    if (dbExists) {
      console.log('✅ Database sẵn sàng - có thể khởi động server');
    } else {
      console.log('⚠️  Cần tạo database trước khi khởi động server');
    }
    
  } catch (error) {
    console.log('❌ LỖI KẾT NỐI:', error.message);
    console.log('');
    console.log('🔧 HƯỚNG DẪN KHẮC PHỤC:');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('   ❌ MySQL server không chạy');
      console.log('   📋 Cách fix:');
      console.log('      1. Mở XAMPP Control Panel');
      console.log('      2. Click "Start" cho MySQL');
      console.log('      3. Đợi status chuyển thành "Running" (màu xanh)');
      console.log('      4. Chạy lại script này');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('   ❌ Sai username/password');
      console.log('   📋 Cách fix:');
      console.log('      1. Kiểm tra file .env');
      console.log('      2. XAMPP mặc định: user=root, password=empty');
    } else {
      console.log('   📋 Lỗi khác:', error.code);
    }
    
    console.log('');
    console.log('🌐 Các URL hữu ích:');
    console.log('   - XAMPP Control: Mở từ Start Menu');
    console.log('   - phpMyAdmin: http://localhost/phpmyadmin');
    console.log('   - XAMPP Dashboard: http://localhost/dashboard');
  }
}

// Chạy test
testConnection();
