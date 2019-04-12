'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bodyParser = require('body-parser');

const {JWT_SECRET, JWT_EXPIRY} = require('../config');
const authRouter = express.Router();

const createAuthToken = function(user) {
    console.log(user);
    return jwt.sign({user}, JWT_SECRET, {
        subject: user.username,
        expiresIn: JWT_EXPIRY,
        algorithm: 'HS256'
    });
};

// authenticate user: the user provides a username and password to login
const localAuth = passport.authenticate('local', {session: false});
authRouter.use(bodyParser.json());
authRouter.post('/login', localAuth, function(req, res) {
    console.log('hello, missy');
    const user = req.user.serialize();
    console.log(user);
    const authToken = createAuthToken(user);
    return res.json({authToken});
});

// refresh token: the user exchanges a valid JWT for a new one with a later expiration date
const jwtAuth = passport.authenticate('jwt', {session: false});
authRouter.post('/refresh', jwtAuth, function(req, res) {
    const user = req.user.serialize();
    const authToken = createAuthToken(user);
    res.json({authToken});
});

module.exports = {authRouter};