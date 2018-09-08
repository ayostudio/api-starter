const passport = require('passport');
const userController = require('../../controllers/user');

module.exports = (app) => {
  app.get(
    '/api/v1/user',
    passport.authenticate('jwt', { session: false }),
    userController.profile,
  );
};
