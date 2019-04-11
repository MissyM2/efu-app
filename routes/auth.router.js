'use strict';

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const {JWT_SECRET, JWT_EXPIRY} = require('../config');

const authRouter = express.Router();

// authenticate upon login
const localAuth = passport.authenticate('local', {session: false, failWithError: True});
router.post('/login', localAuth, function(req, res) {
    const authToken = createAuthToken(req.user);
    console.log(`${req.user.username} successfully logged in.`);
    return res.json(req.user);
});

// refresh token
const jwtAuth = passport.authenticate('jwt', {session: false, failWithError: True});
router.post('/refresh', jwtAuth, function(req, res) {
    const authToken = createAuthToken(req.user);
    console.log(`${req.user.username} token is successfully refreshed.`);
    res.json({authToken});
});

module.exports = {authRouter};