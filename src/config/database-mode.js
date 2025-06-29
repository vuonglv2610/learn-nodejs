/**
 * Cấu hình chế độ database
 * Thay đổi các option này để điều khiển cách tạo bảng
 */

module.exports = {
  // Chế độ sync database
  SYNC_MODE: {
    // Chỉ tạo bảng khi chưa có (KHUYẾN NGHỊ cho development)
    SMART: 'smart',
    
    // Luôn xóa và tạo lại (CHỈ dùng khi cần reset hoàn toàn)
    FORCE: 'force',
    
    // Chỉ cập nhật schema, không tạo bảng mới
    ALTER: 'alter',
    
    // Không sync, chỉ kết nối
    NONE: 'none'
  },
  
  // Chế độ hiện tại (thay đổi ở đây)
  CURRENT_MODE: 'smart', // 'smart' | 'force' | 'alter' | 'none'
  
  // Có tạo data mẫu không
  SEED_DATA: true,
  
  // Có log SQL queries không
  LOG_SQL: false,
  
  // Timeout cho database operations (ms)
  TIMEOUT: 30000
};
