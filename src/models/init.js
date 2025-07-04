/**
 * Module khởi tạo database và associations
 * Đảm bảo tất cả associations được thiết lập trước khi server chạy
 */

let initialized = false;

const initializeDatabase = () => {
  if (initialized) {
    console.log('🔗 Database đã được khởi tạo trước đó');
    return;
  }

  try {
    console.log('🚀 Bắt đầu khởi tạo database...');
    
    // Import và setup associations
    const setupAssociations = require('./associations');
    setupAssociations();
    
    initialized = true;
    console.log('✅ Database và associations đã được khởi tạo thành công');
    
  } catch (error) {
    console.error('❌ Lỗi khi khởi tạo database:', error);
    throw error;
  }
};

module.exports = {
  initializeDatabase,
  isInitialized: () => initialized
};
