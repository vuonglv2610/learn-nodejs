require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const routes = require('./routers');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT;

// Logger
app.use(morgan('combined'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

routes(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
