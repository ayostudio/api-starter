const { createApp } = require('../utils/app');
const { handleErrors } = require('../utils/errors');

const create = (req, res) => {
  const appToCreate = {
    name: req.body.name,
    description: req.body.description,
  };

  createApp({ ...appToCreate, userId: req.user._id })
    .then(app => res.status(200).json({
      message: 'Successfully created a new application',
      app,
    }))
    .catch(err => handleErrors(err, res));
};

module.exports = {
  create,
};
