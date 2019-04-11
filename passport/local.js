'use strict';

const {Strategy: LocalStrategy} = require('passport-local');

const User = require('../models/user.model');

// Define and create basicStrategy
const localStrategy = new LocalStrategy((username, password, callback) => {
  let user;
  User.findOne({ username: username })
    .then(_user => {
      user = _user;
      if(!user) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username'
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
      return callback(null, user);
    })
    .catch(err => {
      if (err.reason === 'LoginError') {
        return callback(null, false);
      }
      return callback(err);
    });
});

module.exports = localStrategy;
