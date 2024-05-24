require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const routes = require('./routers');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT;

// Logger
app.use(morgan('combined'));

// chỉ nhận request có địa chỉ
// app.use(
//   cors({
//     origin: process.env.HTTP,
//   })
// );

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

routes(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
