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

// Thiết lập các mối quan hệ giữa các model
setupAssociations();
sequelize.sync({ force: false })
  .then(() => {
    console.log('✅ Các bảng và quan hệ đã được đồng bộ.');
    // Khởi động server hoặc logic tiếp theo
  })
  .catch((err) => {
    console.error('❌ Lỗi khi sync:', err);
  });

const routesArray = [
  { path: '/api/products', authMiddleware, route: productRoute },
  { path: '/api/categories', route: categoryRoute },
  // { path: '/api/users',authMiddleware, route: userRoute },
  { path: '/api/users', route: userRoute },
  { path: '/api/customers', route: customerRoute },
  { path: '/api/shoppingcart', route: shoppingCartRoute },
  { path: '/api', route: authRoute },
  { path: '/api/roles', route: roleRoute },
  { path: '/api/profile', route: profileRoute },
  { path: '/api/serials', route: serialRoute },
  { path: '/api/orders',authMiddleware, route: orderRoute },
  { path: '/api/brands', route: brandRoute },
  { path: '/api/vouchers', route: voucherRoute },
  { path: '/api/comments', route: commentRoute },
  { path: '/api/payments', route: paymentRoute },
  { path: '/api/statistics', route: statisticsRoute },
  { path: '/api/articles', route: articleRoute },
];

function routes(app) {
  routesArray.forEach((route) => {
    app.use(route.path, route.route);
  });
}

module.exports = routes;
