const mongoose = require('mongoose');
const logger = require('./logger');
const config = require('../config');

mongoose.Promise = global.Promise;

const connectWithRetry = () => mongoose.connect(
  config.mongodbUri,
  {
    useNewUrlParser: true,
    reconnectTries: 30, // Retry up to 30 times
    reconnectInterval: 500, // Reconnect every 500ms
    bufferMaxEntries: 0,
  },
);

mongoose.connection.on('error', (err) => {
  logger('MongoDB connection error', 'error', err);
  setTimeout(connectWithRetry, 5000);
});

mongoose.connection.on('connected', () => {
  logger('MongoDB is connected', 'info');
});

if (config.env === 'development') {
  mongoose.set('debug', true);
}

const connect = () => {
  setTimeout(() => {
    connectWithRetry();
  }, 3000);
};

module.exports = { connect };
