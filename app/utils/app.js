const App = require('../models/app');
const config = require('../config');

/**
 * create app secret and public keys
 * @param {string} enviroment live || test
 */
const createAppKeys = enviroment => new Promise((resolve, reject) => {
  if (!enviroment) return reject(new Error('You need to include an enviroment'));
  const randString = Math.random()
    .toString(15)
    .substr(2);
  return resolve({
    public: `pk_${enviroment}_${randString}`,
    secret: `sk_${enviroment}_${randString}`,
  });
});

/**
 * collect app
 * @param {string} appPublic the public key for the app
 */
const collectApp = publicKey => new Promise((resolve, reject) => {
  if (!publicKey) reject(new Error('You need to provide an app key'));
  App.findOne(
    {
      $or: [{ livePublic: publicKey }, { testPublic: publicKey }],
    },
    (err, app) => {
      if (err) return reject(err);
      if (!app) return reject(new Error('No app found'));
      return resolve({ ...app, isTest: publicKey === app.testPublic });
    },
  );
});

/**
 * Collect the app key from the request
 * @param {object} req The request object
 */
const getAppKeyFromReq = (req) => {
  if (req.authedApp === 'admin' && req.query.app === config.adminKey) {
    return config.adminKey;
  }

  if (req.authedApp && req.authedApp._doc.liveSecret) {
    return req.authedApp.isTest ? req.authedApp._doc.testSecret : req.authedApp._doc.liveSecret;
  }

  return 'not-authenticated';
};

/**
 * Create an application
 * @param {object} app The app object
 */
const createApp = app => Promise.all([createAppKeys('test'), createAppKeys('live')]).then(
  ([testKeys, liveKeys]) => new Promise((resolve, reject) => {
    App.create(
      {
        name: app.name,
        description: app.description,
        userId: app.userId,
        testSecret: testKeys.secret,
        testPublic: testKeys.public,
        liveSecret: liveKeys.secret,
        livePublic: liveKeys.public,
      },
      (err, storedApp) => {
        if (err) reject(err);
        resolve(storedApp);
      },
    );
  }),
);

module.exports = {
  createAppKeys,
  createApp,
  collectApp,
  getAppKeyFromReq,
};
