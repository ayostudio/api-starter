const countryController = require('../../controllers/country');

module.exports = (app) => {
  app.get('/api/v1/countries/supported', countryController.supported);
};
