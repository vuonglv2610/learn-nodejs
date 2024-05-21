const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodejs',
});

connection.connect(function (err) {
  if (err) console.log('Kết nối database thất bại');
});

module.exports = connection;

