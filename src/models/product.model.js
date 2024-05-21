const db = require('./db');
const table = 'products';

module.exports = {
  get: (req, res, result) => {
    db.query(`SELECT * FROM ${table}`, (err, data) => {
      if (err) return console.log(err);
      result(JSON.parse(JSON.stringify(data)));
    });
  },

  getOne: (req, res, result) => {
    db.query(
      `SELECT * FROM ${table} WHERE id = ${req.params.id}`,
      (err, data) => {
        if (err) return console.log(err);
        result(JSON.parse(JSON.stringify(data)));
      }
    );
  },

  create: (req, res, result) => {
    db.query(`INSERT INTO ${table} SET ?`, req.body, (err, data) => {
      if (err) return console.log(err);
      result(req.body);
    });
  },
};

