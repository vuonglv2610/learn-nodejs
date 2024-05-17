const express = require('express');
const path = require('path');
const morgan = require('morgan');
const { engine } = require('express-handlebars');

const app = express();
const port = 9999;

// Logger
app.use(morgan('combined'));

// Cấu hình thư mục views
app.set('view engine', 'hbs');
app.engine('hbs', engine({ extname: '.hbs' }));
app.set('views', path.join(__dirname, 'views'));

// config public path
app.use(express.static(path.join(__dirname, 'views/public')));

// Route
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/news', (req, res) => {
  res.render('news');
});

app.listen(port, () => {
  console.log(`Example app listening on port: http://localhost:${port}`);
});