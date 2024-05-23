const productRoute = require('./product.route');
const categoryRoute = require('./category.route');
const userRoute = require('./user.route');
const authRoute = require('./auth.route');

const routesArray = [
  { path: '/api/product', route: productRoute },
  { path: '/api/category', route: categoryRoute },
  { path: '/api/user', route: userRoute },
  { path: '/api', route: authRoute },
];

function routes(app) {
  routesArray.forEach((route) => {
    app.use(route.path, route.route);
  });
}

module.exports = routes;










