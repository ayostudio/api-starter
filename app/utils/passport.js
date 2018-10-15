const passport = require('passport');
const passportJWT = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../config');
const { getAppKeyFromReq } = require('../utils/app');

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    User.authenticate(),
  ),
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: (req, rawJwtToken, done) => {
        if (req.authedApp === 'admin') {
          return done(null, config.adminKey);
        }

        if (getAppKeyFromReq(req) === 'not-authenticated') {
          return done(new Error('Unauthorized'), null);
        }
        return done(null, getAppKeyFromReq(req));
      },
    },
    (jwtPayload, cb) => User.findById(jwtPayload.id)
      .then(user => cb(null, user))
      .catch(err => cb(err)),
  ),
);

module.exports = passport;
