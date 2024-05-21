const db = require('./db');
const table = 'products';

module.exports = {
  get: (req, res, result) => {
    db.query(`SELECT * FROM ${table} WHERE deleted_at IS NULL`, (err, data) => {
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

  edit: (req, res, result) => {
    db.query(
      `UPDATE ${table} SET name = ?, price = ?, description = ?, category_id = ? WHERE id = ${req.params.id}`,
      [
        req.body.name,
        req.body.price,
        req.body.description,
        req.body.category_id,
      ],
      (err, data) => {
        if (err) return console.log(err);
        result(req.body);
      }
    );
  },

  remove: (req, res, result) => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    db.query(
      `UPDATE ${table} SET deleted_at = ${formattedDate} WHERE id = ${req.params.id} AND deleted_at IS NULL`,
      req.body,
      (err, data) => {
        if (err) return console.log(err);
        result(req.body);
      }
    );
  },
};











































