'use strict';

const passport = require('passport');

// import strategies
const { Strategy: LocalStrategy } = require('passport-local');
const { JwtStrategy, ExtractJwt } = require('passport-jwt');

// import modules
const { Student } = require('../models/student.model');
const { JWT_SECRET } = require('../config');

const localStrategy = new LocalStrategy((studentname, password, passportVerify) => {
  //let student;
  console.log(studentname);
  /*
  Student.findOne({studentname: studentname})
    .then(_student => {
      student = _student;
      console.log(student);
      if (!student) {
        // Return a rejected promise so we break out of the chain of .thens.
        // Any errors like this will be handled in the catch block.
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect studentname or password'
        });
      }
      return Student.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect studentname or password'
        });
      }
      return passportVerify(null, student);
    })
    .catch(err => {
      if (err.reason === 'LoginError') {
        return passportVerify(null, false, err.message);
      }
      return passportVerify(err, false);
    });
    */
   return res.json({message: 'made it through localStrategy'});
});

/*
const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: JWT_SECRET,
    // Look for the JWT as a Bearer auth header
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    // Only allow HS256 tokens - the same as the ones we issue
    algorithms: ['HS256']
  },
  (token, done) => {
    done(null, token.student);
  }
);
*/
const localAuth = passport.authenticate('local', {session: false});
console.log(localAuth);

//const jwtAuth = passport.authenticate('jwt', {session: false});

//module.exports = { localStrategy, jwtStrategy, localAuth, jwtAuth };
module.exports = { localStrategy, localAuth };
