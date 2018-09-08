const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const schema = require('./schema');

schema.plugin(passportLocalMongoose, {
  usernameField: 'email',
});

const model = mongoose.model('User', schema);
module.exports = model;
