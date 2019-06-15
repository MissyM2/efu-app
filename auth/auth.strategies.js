'use strict';

const passport = require('passport');

// import strategies
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

// import modules
const { User } = require('../models/user.model');
const { JWT_SECRET } = require('../config');

const localStrategy = new LocalStrategy((username, password, passportVerify) => {
  let user;
  
  User.findOne({username: username})
    .then(_user => {
      user = _user;
      if (!user) {
        // Return a rejected promise so we break out of the chain of .thens.
        // Any errors like this will be handled in the catch block.
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      return passportVerify(null, user);
    })
    .catch(err => {
      if (err.reason === 'LoginError') {
        return passportVerify(null, false, err.message);
      }
      return passportVerify(err, false);
    });
});


const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: JWT_SECRET,
    // Look for the JWT as a Bearer auth header
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    // Only allow HS256 tokens - the same as the ones we issue
    algorithms: ['HS256']
  },
  (token, done) => {
    done(null, token.user);
  }
);

const localAuth = passport.authenticate('local', {session: false});
const jwtAuth = passport.authenticate('jwt', {session: false});

module.exports = { localStrategy, jwtStrategy, localAuth, jwtAuth };
