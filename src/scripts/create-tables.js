/**
 * Script để tạo bảng theo thứ tự đúng
 * Chạy: node src/scripts/create-tables.js
 */

require('dotenv').config();
const sequelize = require('../models/db');

// Import models theo thứ tự dependency
const RoleModel = require('../models/role.model');
const CategoryModel = require('../models/category.model');
const BrandModel = require('../models/brand.model');
const VoucherModel = require('../models/voucher.model');

const UserModel = require('../models/user.model');
const CustomerModel = require('../models/customer.model');

const ProductModel = require('../models/product.model');
const SerialModel = require('../models/serial.model');

const OrderModel = require('../models/order.model');
const PaymentModel = require('../models/payment.model');

const CommentModel = require('../models/comments.model');
const ArticleModel = require('../models/article.model');
const ShoppingCartModel = require('../models/shoppingcart.model');

async function createTables() {
  try {
    console.log('🔄 Bắt đầu tạo bảng...');

    // 1. Tạo bảng không có foreign key trước
    console.log('📝 Tạo bảng cơ bản...');
    await RoleModel.sync({ force: true });
    console.log('✅ roles');
    
    await CategoryModel.sync({ force: true });
    console.log('✅ categories');
    
    await BrandModel.sync({ force: true });
    console.log('✅ brands');
    
    await VoucherModel.sync({ force: true });
    console.log('✅ vouchers');

    // 2. Tạo bảng có foreign key đến bảng trên
    console.log('📝 Tạo bảng user...');
    await UserModel.sync({ force: true });
    console.log('✅ users');
    
    await CustomerModel.sync({ force: true });
    console.log('✅ customers');

    // 3. Tạo bảng products
    console.log('📝 Tạo bảng products...');
    await ProductModel.sync({ force: true });
    console.log('✅ products');
    
    await SerialModel.sync({ force: true });
    console.log('✅ serials');

    // 4. Tạo bảng orders và payments
    console.log('📝 Tạo bảng orders và payments...');
    await OrderModel.sync({ force: true });
    console.log('✅ orders');
    
    await PaymentModel.sync({ force: true });
    console.log('✅ payments');

    // 5. Tạo bảng còn lại
    console.log('📝 Tạo bảng còn lại...');
    await CommentModel.sync({ force: true });
    console.log('✅ comments');
    
    await ArticleModel.sync({ force: true });
    console.log('✅ articles');
    
    await ShoppingCartModel.sync({ force: true });
    console.log('✅ shoppingcart');

    console.log('🎉 Tất cả bảng đã được tạo thành công!');
    
    // Bây giờ setup associations
    console.log('🔗 Thiết lập relationships...');
    const setupAssociations = require('../models/associations');
    setupAssociations();
    
    console.log('✅ Hoàn thành! Database đã sẵn sàng.');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Lỗi khi tạo bảng:', error);
    console.error('Chi tiết:', error.message);
    process.exit(1);
  }
}

// Chạy script
createTables();
