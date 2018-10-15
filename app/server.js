const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config');
const passport = require('./utils/passport');
const logger = require('./utils/logger');
const { permissions } = require('./middleware');

const app = express();

module.exports = (isTest = false) => {
  app.use(cors());
  app.use(compression());
  app.use(passport.initialize());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.engine('.ejs', require('ejs').__express);
  app.use('/public', express.static(`${__dirname}/views`));
  app.set('view engine', 'ejs');

  app.use('/api/*', permissions);

  // Read Version 1 Routes
  fs.readdirSync(`${__dirname}/routes/v1`).forEach((file) => {
    require(`./routes/v1/${file}`)(app);
  });

  app.get('*', (req, res) => res.status(404).json({
    message: "Seems like the endpoint you're looking for no longer exists 🤔",
  }));

  app.use((err, req, res, next) => {
    if (err) {
      logger('There was an error 😲', 'error', err.stack);
      throw err;
    }

    next();
  });

  if (!isTest) {
    const db = require('./utils/db');
    app.use(morgan('common'));
    db.connect();

    app.listen(config.port, () => {
      logger(`App listening on port ${config.port}`, 'info');
    });
  }

  return app;
};
