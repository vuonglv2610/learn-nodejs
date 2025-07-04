require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT;

// Khởi tạo database và associations trước khi làm gì khác
const { initializeDatabase } = require('./models/init');
initializeDatabase();

// Import routes sau khi database đã được khởi tạo
const routes = require('./routers');
const app = express();

// Logger
app.use(morgan('combined'));

// chỉ nhận request có địa chỉ
app.use(
  cors({
    origin: ['http://localhost:3000', process.env.HTTP].filter(Boolean),
  })
);

app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));
app.use(bodyParser.json({ limit: '20mb' }));
app.use(express.json());

routes(app);

app.get("*", (req,res)=>{
  res.send(`
    <div>
      <h1>404 Not Found</h1>
    </div>`
  )
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
