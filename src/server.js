require('dotenv').config();
const express = require('express');
const app = express();

const port = process.env.PORT;

const testData = {
  name: 'vuong',
  old: 12,
  desc: 'handsome'
}

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(testData)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})