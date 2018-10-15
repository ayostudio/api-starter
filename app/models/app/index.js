const mongoose = require('mongoose');
const schema = require('./schema');

const model = mongoose.model('App', schema);
module.exports = model;
