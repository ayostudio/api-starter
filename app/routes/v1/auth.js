const authController = require('../../controllers/auth');

module.exports = (app) => {
  app.post('/api/v1/auth/login', authController.login);
  app.post('/api/v1/auth/register', authController.register);
};
