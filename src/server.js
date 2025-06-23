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
