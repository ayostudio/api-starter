const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user');
const config = require('../config');

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
      type: userData.type,
      country: userData.country,
      termsSignedAt: userData.termsSigned ? new Date() : null,
    }),
    userData.password,
    (err, user) => {
      if (err) return reject(err);
      resolve(user);
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
const getAccessToken = (user, appKey = config.adminKey) => new Promise((resolve, reject) => {
  if (!user || !user.email || !user.id) return reject(new Error('User is missing'));
  const token = jwt.sign({ id: user.id, email: user.email }, appKey);
  return resolve({ user, token });
});

/**
 * Salt existing users accounts for higher security
 * @param {string} email The users email address
 * @param {string} password The users password
 * @returns {promise} A promise containing users data
 */
const saltExistingUsers = (email, password) => new Promise((resolve, reject) => {
  if (!email || !password) {
    return reject(new Error('Incorrect information'));
  }
  User.findByUsername(email, async (err, user) => {
    if (err) return reject(err);
    if (!user) return reject(new Error('Incorrect information'));
    const data = { ...user }._doc;
    if (data.password && !data.salt) {
      const match = bcrypt.compareSync(password, data.password);
      if (match) {
        await user.setPassword(password);
        user.save(() => resolve(user));
      } else {
        return reject(new Error('Incorrect information'));
      }
    } else {
      return resolve(user);
    }
  });
});

module.exports = {
  registerUser,
  authenticate,
  getAccessToken,
  saltExistingUsers,
};
