'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const {JWT_SECRET, JWT_EXPIRY} = require('../config');

const authRouter = express.Router();
const localAuth = passport.authenticate('local', {session: false});
const jwtAuth = passport.authenticate('jwt', {session: false});

function createAuthToken(user) {
    return jwt.sign({user}, JWT_SECRET, {
        subject: user.username,
        expiresIn: JWT_EXPIRY,
        algorithm: 'HS256'
    });
};

// authenticate upon login
authRouter.post('/login', localAuth, function(req, res) {
    const user = req.user.serialize();
    const authToken = createAuthToken(user);
    return res.json({authToken});
});

// refresh token
authRouter.post('/refresh', jwtAuth, function(req, res) {
    const user = req.user.serialize();
    const authToken = createAuthToken(user);
    res.json({authToken});
});

module.exports = {authRouter};