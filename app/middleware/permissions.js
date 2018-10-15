const config = require('../config');
const { collectApp } = require('../utils/app');

const adminRoutes = [
  { path: '/api/v1/apps', method: 'post' },
  { path: '/api/v1/auth/login', method: 'post' },
  { path: '/api/v1/auth/register', method: 'post' },
];

module.exports = (req, res, next) => {
  const { baseUrl, method, query } = req;
  const isAdminRoute = adminRoutes.filter(
    route => route.path === baseUrl && method.toLowerCase() === route.method,
  ).length;

  if (!query.app) {
    return res.status(422).json({
      message: 'You need to include you app key.',
      statusCode: 422,
    });
  }

  if (query.app === config.adminKey) {
    req.authedApp = 'admin';
    return next();
  }

  if (isAdminRoute) {
    return res.status(401).json({
      message: 'Unauthorized, only admin apps can use these endpoints.',
      statusCode: 401,
    });
  }

  collectApp(query.app)
    .then((app) => {
      req.authedApp = app;
      return next();
    })
    .catch(() => res.status(401).json({
      message: 'No app found',
      statusCode: 401,
    }));
};
