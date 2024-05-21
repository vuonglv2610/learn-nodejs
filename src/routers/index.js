const productRoute = require('./product.route');
const categoryRoute = require('./category.route');

const routesArray = [
  { path: '/api/product', route: productRoute },
  { path: '/api/category', route: categoryRoute },
];

function routes(app) {
  routesArray.forEach((route) => {
    app.use(route.path, route.route);
  });
}

module.exports = routes;

