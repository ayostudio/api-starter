const { getSupportedCountriesArray } = require('../utils/countries');

const supported = (req, res) => {
  const supportedCountries = getSupportedCountriesArray();
  return res.status(200).json({
    message: 'Successfully collected countries',
    countries: supportedCountries,
  });
};

module.exports = {
  supported,
};
