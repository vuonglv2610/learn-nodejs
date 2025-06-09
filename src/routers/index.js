const productRoute = require('./product.route');
const categoryRoute = require('./category.route');
const userRoute = require('./user.route');
const authRoute = require('./auth.route');
const shoppingCartRoute = require('./shoppingcart.route');
const roleRoute = require('./role.route');
const customerRoute = require('./customer.route');
const profileRoute = require('./profile.route');
const serialRoute = require('./serial.route');

const routesArray = [
  { path: '/api/products', route: productRoute },
  { path: '/api/categories', route: categoryRoute },
  { path: '/api/users', route: userRoute },
  { path: '/api/customers', route: customerRoute },
  { path: '/api/shoppingcart', route: shoppingCartRoute },
  { path: '/api', route: authRoute },
  { path: '/api/roles', route: roleRoute },
  { path: '/api/profile', route: profileRoute },
  { path: '/api/serials', route: serialRoute },
];

function routes(app) {
  routesArray.forEach((route) => {
    app.use(route.path, route.route);
  });
}

module.exports = routes;
