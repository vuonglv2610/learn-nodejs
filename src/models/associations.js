// Import tất cả các model
const Product = require('./product.model');
const Category = require('./category.model');
const Serial = require('./serial.model');
const ShoppingCart = require('./shoppingcart.model');
const User = require('./user.model');
const Roles = require('./role.model');
const Order = require('./order.model');
const Customer = require('./customer.model');
const Brand = require('./brand.model');
const Voucher = require('./voucher.model');
const Comment = require('./comments.model');
const Payment = require('./payment.model');
const Article = require('./article.model');

// Thiết lập các mối quan hệ
const setupAssociations = () => {
  // Thiết lập quan hệ cho Product
  Product.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'category'
  });
  
  // Thêm quan hệ với Brand
  Product.belongsTo(Brand, {
    foreignKey: 'brandId',
    as: 'brand'
  });

  // Thiết lập quan hệ cho Brand
  Brand.hasMany(Product, {
    foreignKey: 'brandId',
    as: 'products'
  });

  // Thiết lập quan hệ cho Product-Serial
  Product.hasMany(Serial, {
    foreignKey: 'productId',
    as: 'serials'
  });

  // Thiết lập quan hệ cho Category
  Category.hasMany(Product, {
    foreignKey: 'categoryId',
    as: 'products'
  });

  // Thiết lập quan hệ cho Serial
  Serial.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product'
  });

  // Thiết lập quan hệ cho ShoppingCart
  ShoppingCart.belongsTo(Product, {
    foreignKey: 'product_id',
    as: 'product'
  });

  // Thiết lập quan hệ cho User và Roles
  User.belongsTo(Roles, {
    foreignKey: 'roleId',
    as: 'role'
  });

  Roles.hasMany(User, {
    foreignKey: 'roleId',
    as: 'users'
  });

  // Thiết lập quan hệ cho Customer và Roles
  // Customer.belongsTo(Roles, {
  //   foreignKey: 'roleId',
  //   as: 'role'
  // });

  // Roles.hasMany(Customer, {
  //   foreignKey: 'roleId',
  //   as: 'customers'
  // });

  // Order liên kết với Customer
  Order.belongsTo(Customer, {
    foreignKey: 'customerId',
    as: 'customer'
  });

  // Customer có nhiều Order
  Customer.hasMany(Order, {
    foreignKey: 'customerId',
    as: 'orders'
  });

  // Thiết lập quan hệ cho Comment
  Comment.belongsTo(Customer, {
    foreignKey: 'customerId',
    as: 'customer'
  });

  Comment.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product'
  });

  // Thiết lập quan hệ ngược lại
  Customer.hasMany(Comment, {
    foreignKey: 'customerId',
    as: 'comments'
  });

  Product.hasMany(Comment, {
    foreignKey: 'productId',
    as: 'comments'
  });

  // Thiết lập quan hệ cho Payment
  Payment.belongsTo(Order, {
    foreignKey: 'orderId',
    as: 'order'
  });

  Payment.belongsTo(Customer, {
    foreignKey: 'customerId',
    as: 'customer'
  });

  Payment.belongsTo(Voucher, {
    foreignKey: 'voucherId',
    as: 'voucher'
  });

  // Thiết lập quan hệ ngược lại
  Order.hasMany(Payment, {
    foreignKey: 'orderId',
    as: 'payments'
  });

  Customer.hasMany(Payment, {
    foreignKey: 'customerId',
    as: 'payments'
  });

  Voucher.hasMany(Payment, {
    foreignKey: 'voucherId',
    as: 'payments'
  });

  // Thiết lập quan hệ cho Article
  Article.belongsTo(User, {
    foreignKey: 'userId',
    as: 'author'
  });

  // User có nhiều Article
  User.hasMany(Article, {
    foreignKey: 'userId',
    as: 'articles'
  });

  // Thiết lập các quan hệ khác nếu cần
};

module.exports = setupAssociations;



