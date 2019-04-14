'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');

const {JWT_SECRET, JWT_EXPIRY} = require('../config');
const {localAuth, jwtAuth} = require('./auth.strategies');

const authRouter = express.Router();
/*
function createAuthToken(student) {
    return jwt.sign({student}, JWT_SECRET, {
        subject: student.studentname,
        expiresIn: JWT_EXPIRY,
        algorithm: 'HS256'
    });
};
*/
console.log(localAuth);
// authenticate student: the student provides a studentname and password to login
authRouter.post('/login', localAuth, (req, res) => {
    console.log('after authRouter');
    console.log(req.body);
    //const student = req.student.serialize();
    //const authToken = createAuthToken(student);
    //return res.json({authToken, student});
    return res.json({message: 'made it past post!'});
});

// refresh token: the student exchanges a valid JWT for a new one with a later expiration date
/*
authRouter.post('/refresh', jwtAuth, function(req, res) {
    const student = req.student.serialize();
    const authToken = createAuthToken(student);
    res.json({authToken});
});
*/
module.exports = {authRouter};