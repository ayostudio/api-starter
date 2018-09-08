const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user');

/**
 * Register the user to the database
 * @param {object} userData Object containing the user data
 * @returns {promise} A promise containing the registered user
 */
const registerUser = userData => new Promise((resolve, reject) => {
  User.register(
    new User({
      email: userData.email,
      name: userData.name,
    }),
    userData.password,
    (err, user) => {
      if (err) return reject(err);
      return resolve(user);
    },
  );
});

/**
 * Authenticate the user
 * @param {object} user The user object
 * @returns {promise} Promise containing the user data
 */
const authenticate = user => new Promise((resolve, reject) => {
  User.authenticate()(user.email, user.password, (err, authedUser) => {
    if (!authedUser) return reject(new Error('User information incorrect'));
    return resolve(authedUser);
  });
});

/**
 * Get the access token of the user
 * @param {object} user The user object
 * @returns {promise} Promise containing the user data and the token
 */
const getAccessToken = user => new Promise((resolve, reject) => {
  if (!user || !user.email || !user.id) return reject(new Error('User is missing'));
  const token = jwt.sign({ id: user.id, email: user.email }, config.secret);
  return resolve({ user, token });
});

module.exports = {
  registerUser,
  authenticate,
  getAccessToken,
};
