const { buildValidationResponse } = require('./validation');

/**
 * Handle errors
 * @param {object} err The error object
 * @param {object} res The response object
 * @returns {Response} Returns a response depending on the error
 */
const handleErrors = (err, res) => {
  if (err.name && err.name === 'ValidationError') {
    return res.status(422).json({
      message: 'There was an issue with your request',
      errors: buildValidationResponse(err.errors),
    });
  }

  // Authentication errors
  if (err.name === 'UserExistsError') {
    return res.status(422).json({
      message: 'There was an issue with your request',
      errors: {
        email: {
          message: 'Email already in use',
        },
      },
    });
  } if (err.name === 'MissingUsernameError') {
    return res.status(422).json({
      message: 'There was an issue with your request',
      errors: {
        email: {
          message: 'Email is required',
        },
      },
    });
  } if (err.name === 'MissingPasswordError') {
    return res.status(422).json({
      message: 'There was an issue with your request',
      errors: {
        password: {
          message: 'Password is required',
        },
      },
    });
  }

  if (err instanceof Error) {
    return res.status(422).json({
      message: 'There was an issue with your request',
      error: err.message,
    });
  }

  return res.status(500).json({
    message: 'An error occurred 😲',
    error: err,
  });
};

module.exports = {
  handleErrors,
};
