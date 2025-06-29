const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306, // MySQL default port
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,
    dialectOptions: {
      connectTimeout: 10000, // tuỳ chọn thêm: tránh lỗi timeout
    },
    dialectModule: require('mysql2'),
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    },
  }
);


// Kiểm tra kết nối
sequelize
  .authenticate()
  .then(() => {
    console.log('Kết nối cơ sở dữ liệu thành công.');
  })
  .catch((err) => {
    console.error('Không thể kết nối đến cơ sở dữ liệu:', err);
  });

module.exports = sequelize;

// Sau khi export sequelize, các model sẽ được import và định nghĩa
// Sau đó, setupAssociations sẽ được gọi để thiết lập mối quan hệ




