const getSupportedCountries = () => ({
  US: {
    country: 'United States',
    currency: 'USD',
    symbol: '$',
    supportsBankPayouts: true,
    fiscalStart: { month: 10, day: 1 },
    fiscalEnd: { month: 9, day: 30 },
  },
  GB: {
    country: 'United Kingdom',
    currency: 'GBP',
    symbol: '£',
    supportsBankPayouts: true,
    fiscalStart: { month: 4, day: 6 },
    fiscalEnd: { month: 4, day: 5 },
  },
  AU: {
    country: 'Australia',
    currency: 'AUD',
    symbol: '$',
    supportsBankPayouts: true,
    fiscalStart: { month: 7, day: 1 },
    fiscalEnd: { month: 6, day: 30 },
  },
  DK: {
    country: 'Denmark',
    currency: 'DKK',
    symbol: 'DKK',
    afterCurrency: true,
    supportsBankPayouts: true,
    fiscalStart: { month: 1, day: 1 },
    fiscalEnd: { month: 12, day: 31 },
  },
  CA: {
    country: 'Canada',
    currency: 'CAD',
    symbol: '$',
    supportsBankPayouts: true,
    fiscalStart: { month: 4, day: 1 },
    fiscalEnd: { month: 3, day: 31 },
  },
  SE: {
    country: 'Sweden',
    currency: 'SEK',
    symbol: 'SEK',
    afterCurrency: true,
    supportsBankPayouts: true,
    fiscalStart: { month: 1, day: 1 },
    fiscalEnd: { month: 12, day: 31 },
  },
  NO: {
    country: 'Norway',
    currency: 'NOK',
    symbol: 'NOK',
    afterCurrency: true,
    supportsBankPayouts: true,
    fiscalStart: { month: 1, day: 1 },
    fiscalEnd: { month: 12, day: 31 },
  },
  FR: {
    country: 'France',
    currency: 'EUR',
    symbol: '€',
    supportsBankPayouts: true,
    fiscalStart: { month: 1, day: 1 },
    fiscalEnd: { month: 12, day: 31 },
  },
  AT: {
    country: 'Austria',
    currency: 'EUR',
    symbol: '€',
    supportsBankPayouts: true,
    fiscalStart: { month: 1, day: 1 },
    fiscalEnd: { month: 12, day: 31 },
  },
  MX: {
    country: 'Mexico',
    currency: 'EUR',
    symbol: '€',
    supportsBankPayouts: true,
    fiscalStart: { month: 1, day: 1 },
    fiscalEnd: { month: 12, day: 31 },
  },
  BE: {
    country: 'Belgium',
    currency: 'EUR',
    symbol: '€',
    supportsBankPayouts: true,
    fiscalStart: { month: 1, day: 1 },
    fiscalEnd: { month: 12, day: 31 },
  },
  IE: {
    country: 'Ireland',
    currency: 'EUR',
    symbol: '€',
    supportsBankPayouts: true,
    fiscalStart: { month: 1, day: 1 },
    fiscalEnd: { month: 12, day: 31 },
  },
  NE: {
    country: 'Netherlands',
    currency: 'EUR',
    symbol: '€',
    supportsBankPayouts: true,
    fiscalStart: { month: 1, day: 1 },
    fiscalEnd: { month: 12, day: 31 },
  },
  NZ: {
    country: 'New Zealand',
    currency: 'EUR',
    symbol: '€',
    supportsBankPayouts: true,
    fiscalStart: { month: 4, day: 1 },
    fiscalEnd: { month: 3, day: 31 },
  },
  ES: {
    country: 'Spain',
    currency: 'EUR',
    symbol: '€',
    supportsBankPayouts: true,
    fiscalStart: { month: 1, day: 1 },
    fiscalEnd: { month: 12, day: 31 },
  },
});

/**
 * Get the list of supported countries in array format
 */
const getSupportedCountriesArray = () => {
  const supportedCountries = getSupportedCountries();
  const arrayResponse = Object.keys(supportedCountries).map(key => ({
    value: key,
    label: supportedCountries[key].country,
  }));
  return arrayResponse;
};

/**
 * Collect the country code
 * @param {string} country The country you're trying to optain
 * @returns {promise} Returns a proimse containing the country object
 */
const getCountryCode = country => new Promise((resolve, reject) => {
  const supportedCurrencies = getSupportedCountries();
  const found = Object.keys(supportedCurrencies).filter(
    key => supportedCurrencies[key].country.toLowerCase() === country.toLowerCase(),
  );
  if (found.length > 0) {
    return resolve(found[0]);
  }
  return reject(new Error('Unsupported country'));
});

/**
 * Collect the country currency symbol
 * @param {string} currency The currency you're looking for
 * @returns {promise} Promise containing the currency symbol
 */
const getCurrencySymbol = currency => new Promise((resolve, reject) => {
  const supportedCurrencies = getSupportedCountries();

  const found = Object.keys(supportedCurrencies).filter(
    key => supportedCurrencies[key].currency.toLowerCase() === currency.toLowerCase(),
  );
  if (found.length > 0) {
    return resolve(supportedCurrencies[found[0]].symbol);
  }
  reject(new Error('Unsupported country'));
});

/**
 * Collect the country currency
 * @param {string} country The country you're trying to optain the currency for
 * @returns {promise} A promise containing the countries currency
 */
const getCountryCurrency = country => new Promise((resolve, reject) => {
  const supportedCurrencies = getSupportedCountries();

  const found = Object.keys(supportedCurrencies).filter(
    key => supportedCurrencies[key].country.toLowerCase() === country.toLowerCase(),
  );
  if (found.length > 0) {
    return resolve(supportedCurrencies[found[0]].currency);
  }
  reject(new Error('Unsupported country'));
});

/**
 * Collect the country fiscal year
 * @param {string} country The country you're trying to optain
 * @returns {promise} A promise containing the start and end date for the fiscal year
 */
const getFiscalYear = country => new Promise((resolve, reject) => {
  const supportedCurrencies = getSupportedCountries();

  const found = Object.keys(supportedCurrencies).filter(
    key => supportedCurrencies[key].country.toLowerCase() === country.toLowerCase(),
  );
  if (found.length > 0) {
    return resolve({
      start: supportedCurrencies[found[0]].fiscalStart,
      end: supportedCurrencies[found[0]].fiscalEnd,
    });
  }
  reject(new Error('Unsupported country'));
});

module.exports = {
  getSupportedCountries,
  getCountryCode,
  getCountryCurrency,
  getCurrencySymbol,
  getFiscalYear,
  getSupportedCountriesArray,
};
