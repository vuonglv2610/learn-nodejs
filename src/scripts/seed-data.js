/**
 * Script để tạo data mẫu sau khi tạo bảng
 * Chạy tự động sau khi sync database
 */

const { v4: uuidv4 } = require('uuid');

async function seedInitialData() {
  try {
    console.log('🌱 Bắt đầu tạo data mẫu...');
    
    const RoleModel = require('../models/role.model');
    const CategoryModel = require('../models/category.model');
    const BrandModel = require('../models/brand.model');
    const VoucherModel = require('../models/voucher.model');
    
    // 1. Tạo roles
    const roles = await RoleModel.bulkCreate([
      {
        id: uuidv4(),
        role: 'ADMIN',
        role_key: 'admin'
      },
      {
        id: uuidv4(),
        role: 'STAFF',
        role_key: 'staff'
      },
    ], { ignoreDuplicates: true });
    console.log('✅ Đã tạo roles:', roles.length);
    
    // 2. Tạo categories
    const categories = await CategoryModel.bulkCreate([
      {
        id: uuidv4(),
        name: 'Electronics',
        description: 'Thiết bị điện tử, công nghệ'
      },
      {
        id: uuidv4(),
        name: 'Clothing',
        description: 'Quần áo, thời trang'
      },
      {
        id: uuidv4(),
        name: 'Books',
        description: 'Sách, tài liệu học tập'
      },
      {
        id: uuidv4(),
        name: 'Sports',
        description: 'Đồ thể thao, gym'
      }
    ], { ignoreDuplicates: true });
    console.log('✅ Đã tạo categories:', categories.length);
    
    // 3. Tạo brands
    const brands = await BrandModel.bulkCreate([
      {
        id: uuidv4(),
        name: 'Apple',
        logo: 'https://example.com/apple-logo.png'
      },
      {
        id: uuidv4(),
        name: 'Samsung',
        logo: 'https://example.com/samsung-logo.png'
      },
      {
        id: uuidv4(),
        name: 'Nike',
        logo: 'https://example.com/nike-logo.png'
      },
      {
        id: uuidv4(),
        name: 'Adidas',
        logo: 'https://example.com/adidas-logo.png'
      },
      {
        id: uuidv4(),
        name: 'Sony',
        logo: 'https://example.com/sony-logo.png'
      }
    ], { ignoreDuplicates: true });
    console.log('✅ Đã tạo brands:', brands.length);
    
    // 4. Tạo vouchers mẫu
    const vouchers = await VoucherModel.bulkCreate([
      {
        id: uuidv4(),
        code: 'WELCOME10',
        discount_percent: 10,
        start_date: new Date(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 ngày
        quantity: 100,
        used: 0
      },
      {
        id: uuidv4(),
        code: 'SUMMER20',
        discount_percent: 20,
        start_date: new Date(),
        end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 ngày
        quantity: 50,
        used: 0
      }
    ], { ignoreDuplicates: true });
    console.log('✅ Đã tạo vouchers:', vouchers.length);
    
    console.log('🎉 Hoàn thành tạo data mẫu!');
    console.log('📊 Tổng kết:');
    console.log(`   - ${roles.length} roles`);
    console.log(`   - ${categories.length} categories`);
    console.log(`   - ${brands.length} brands`);
    console.log(`   - ${vouchers.length} vouchers`);
    
    return {
      roles,
      categories,
      brands,
      vouchers
    };
    
  } catch (error) {
    console.error('❌ Lỗi khi tạo data mẫu:', error.message);
    throw error;
  }
}

module.exports = seedInitialData;
