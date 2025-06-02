const productRoute = require('./product.route');
const categoryRoute = require('./category.route');
const userRoute = require('./user.route');
const authRoute = require('./auth.route');
const shoppingCartRoute = require('./shoppingcart.route');

const routesArray = [
  { path: '/api/products', route: productRoute },
  { path: '/api/categories', route: categoryRoute },
  { path: '/api/user', route: userRoute },
  { path: '/api/shoppingcart', route: shoppingCartRoute },
  { path: '/api', route: authRoute },
];

function routes(app) {
  routesArray.forEach((route) => {
    app.use(route.path, route.route);
  });
}

module.exports = routes;