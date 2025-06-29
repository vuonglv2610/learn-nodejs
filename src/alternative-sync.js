// Alternative: Sync tất cả bảng với tắt foreign key checks
// Thay thế code trong index.js nếu muốn

const sequelize = require('./models/db');
const setupAssociations = require('./models/associations');

async function syncAllTables() {
  try {
    console.log('🔄 Bắt đầu tạo tất cả bảng tự động...');
    
    // Tắt foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    console.log('🔓 Đã tắt foreign key checks');
    
    // Setup associations trước
    setupAssociations();
    console.log('🔗 Đã setup associations');
    
    // Sync tất cả bảng
    await sequelize.sync({ force: true });
    console.log('📝 Đã tạo tất cả bảng');
    
    // Bật lại foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('🔒 Đã bật lại foreign key checks');
    
    console.log('🎉 Tất cả bảng đã được tạo thành công!');
    
  } catch (error) {
    console.error('❌ Lỗi khi tạo bảng:', error.message);
    
    // Đảm bảo bật lại foreign key checks dù có lỗi
    try {
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    } catch (e) {
      console.error('❌ Không thể bật lại foreign key checks:', e.message);
    }
  }
}

// Export để dùng trong index.js
module.exports = syncAllTables;

// Hoặc chạy trực tiếp
if (require.main === module) {
  syncAllTables();
}
