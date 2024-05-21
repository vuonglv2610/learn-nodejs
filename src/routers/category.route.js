const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('get list');
});

router.get('/:id', (req, res) => {
  res.send('get detail');
});

router.post('/', (req, res) => {
  res.send('add new');
});

router.put('/edit/:id', (req, res) => {
  res.send('update');
});

module.exports = router;

