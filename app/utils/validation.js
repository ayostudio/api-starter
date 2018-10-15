/**
 * Is the email a valid email
 * @param {string} email The email
 */
const isEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Check if the value is unique
 * @param {string} value The value you're checking against
 * @param {string} model the model you want to use
 * @param {string} key The key you're checking against in the model
 */
const isUnique = async (value, model = 'user', key = 'email') => {
  try {
    const Model = require(`../models/${model}`);
    const query = {};
    query[key] = value;
    const exists = await Model.find(query).countDocuments();
    return exists === 0;
  } catch (err) {
    return new Error(err);
  }
};

/**
 * Check if a string contains another string
 * @param {string} needle The item you're looking for
 * @param {string} haystack The full string
 */
const doesContain = (needle, haystack) => haystack.trim().includes(needle);

/**
 * Check if the value exists in the array
 * @param {array} array The array you're looking in
 * @param {string} value The value that you're looking for
 */
const isIn = (array, value) => {
  const find = array.filter(item => item === value);
  return find.length > 0;
};

/**
 * Check if the country code is a valid county code
 * @param {string} value The country code
 */
const isValidCountryCode = (value) => {
  const countries = require('./countries');
  const avaliableCountries = countries.getSupportedCountries();
  const find = Object.keys(avaliableCountries).filter(key => key === value);
  return find.length > 0;
};

/**
 * Rebuilds the object into a nicer validation response
 * @param {object} errorObj The error object from express validation
 */
const buildValidationResponse = (errorObj) => {
  const errors = {};
  if (typeof errorObj !== 'object') {
    return new Error('You need to pass a valid express validation object');
  }

  Object.keys(errorObj).map((key) => {
    errors[key] = {
      message: errorObj[key].message,
      value: errorObj[key].value,
    };
  });

  return errors;
};

module.exports = {
  isEmail,
  isUnique,
  isValidCountryCode,
  doesContain,
  isIn,
  buildValidationResponse,
};
