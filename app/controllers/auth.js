const { handleErrors } = require('../utils/errors');
const { getAppKeyFromReq } = require('../utils/app');
const { sendEmail } = require('../utils/sendgrid');

const {
  registerUser,
  authenticate,
  getAccessToken,
  saltExistingUsers,
} = require('../utils/authenticate');

const register = (req, res) => {
  const userToRegister = {
    email: req.body.email,
    name: req.body.name,
    type: req.body.type,
    country: req.body.country,
    termsSigned: req.body.termsSigned,
    password: req.body.password,
  };

  registerUser(userToRegister)
    .then(user => sendEmail(user, 'Confirm your email address', 'confirm'))
    .then(() => authenticate(userToRegister))
    .then(user => getAccessToken(user, getAppKeyFromReq(req)))
    .then(({ user, token }) => res.status(200).json({
      message: 'Successfully created new account 👏',
      user,
      token,
    }))
    .catch(err => handleErrors(err, res));
};

const login = (req, res) => {
  saltExistingUsers(req.body.email, req.body.password)
    .then(() => authenticate({
      email: req.body.email,
      password: req.body.password,
    }))
    .then(user => getAccessToken(user, getAppKeyFromReq(req)))
    .then(({ user, token }) => res.status(200).json({
      message: 'Successfully logged in 🎉',
      user,
      token,
    }))
    .catch(err => handleErrors(err, res));
};

module.exports = {
  register,
  login,
};
