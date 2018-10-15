const emailController = require('../../controllers/email');

module.exports = (app) => {
  app.get('/emails/confirm', emailController.confirm);
};
