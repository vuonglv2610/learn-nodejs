// Import tất cả các model
const Product = require('./product.model');
const Category = require('./category.model');
const Serial = require('./serial.model');
const ShoppingCart = require('./shoppingcart.model');
const User = require('./user.model');
const Roles = require('./role.model');
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
  
  // Thiết lập các quan hệ khác nếu cần
};

module.exports = setupAssociations;


