const { handleErrors } = require('../utils/errors');
const {
  registerUser,
  authenticate,
  getAccessToken,
} = require('../utils/authenticate');

const register = (req, res) => {
  const userToRegister = {
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
  };

  registerUser(userToRegister)
    .then(() => authenticate(userToRegister))
    .then(user => getAccessToken(user))
    .then(({ user, token }) => res.status(200).json({
      message: 'Successfully created new account 👏',
      user,
      token,
    }))
    .catch(err => handleErrors(err, res));
};

const login = (req, res) => {
  authenticate({
    email: req.body.email,
    password: req.body.password,
  })
    .then(user => getAccessToken(user))
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
