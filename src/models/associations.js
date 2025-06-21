// Import tất cả các model
const Product = require('./product.model');
const Category = require('./category.model');
const Serial = require('./serial.model');
const ShoppingCart = require('./shoppingcart.model');
const User = require('./user.model');
const Roles = require('./role.model');
const Order = require('./order.model');
// Import các model khác nếu cần

// Thiết lập các mối quan hệ
const setupAssociations = () => {
  // Thiết lập quan hệ cho Product
  Product.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'category'
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
  
  // Thiết lập quan hệ cho Order
  Order.belongsTo(User, {
    foreignKey: 'customer_id',
    as: 'customer'
  });
  
  // Cập nhật quan hệ cho User
  User.hasMany(Order, {
    foreignKey: 'customer_id',
    as: 'orders'
  });
  
  // Thiết lập các quan hệ khác nếu cần
};

module.exports = setupAssociations;



