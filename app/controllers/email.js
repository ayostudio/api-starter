const User = require('../models/user');
const { handleErrors } = require('../utils/errors');

const confirm = (req, res) => {
  const userId = req.query.id;
  const emailUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  const appUrl = `${req.protocol}://${req.get('host')}`;
  User.findOne({ _id: userId }, (err, user) => {
    if (err) return handleErrors(err, res);
    res.render(`${__dirname}/../views/emails/confirm.ejs`, {
      user,
      emailUrl,
      appUrl,
    });
  });
};

module.exports = {
  confirm,
};
