'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');

const {JWT_SECRET, JWT_EXPIRY} = require('../config');
const {localAuth, jwtAuth} = require('./auth.strategies');

const authRouter = express.Router();

function createAuthToken(user) {
    return jwt.sign({user}, JWT_SECRET, {
        subject: user.username,
        expiresIn: JWT_EXPIRY,
        algorithm: 'HS256'
    });
};

console.log(localAuth);
// authenticate user: the user provides a username and password to login
authRouter.post('/login', localAuth, (req, res) => {
    console.log('after authRouter');
    console.log(req.body);
    const user = req.user.serialize();
    const authToken = createAuthToken(user);
    return res.json({authToken, user});
});

// refresh token: the user exchanges a valid JWT for a new one with a later expiration date

authRouter.post('/refresh', jwtAuth, function(req, res) {
    const user = req.user.serialize();
    const authToken = createAuthToken(user);
    res.json({authToken});
});

module.exports = {authRouter};