const passport = require('passport');
const appController = require('../../controllers/app');

module.exports = (app) => {
  app.post('/api/v1/apps', passport.authenticate('jwt', { session: false }), appController.create);
};
