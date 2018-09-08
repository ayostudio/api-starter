const healthcheck = require('express-healthcheck');
const mongoose = require('mongoose');

module.exports = (app) => {
  app.get(
    '/health',
    healthcheck({
      test: () => {
        const state = mongoose.connection.readyState;
        if (state === 0 || state === 3) return { health: 'Database is diconnected! ❌' };
        return null;
      },
      healthy: () => ({ health: "We're up and running healthy ✅" }),
    }),
  );
};
