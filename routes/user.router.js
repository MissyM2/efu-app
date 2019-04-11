'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const {User} = require('../models/user.model');

const userRouter = express.Router();

const jsonParser = bodyParser.json();

// add a new user
userRouter.post('/', jsonParser, (req, res) => {

     // check that all req fields are present 
     const reqFields = ['user_loginidemail', 'user_password'];
     const missingField = reqFields.find(field => !(field in req.body));
     if (missingField) {
         return res.status(422).json({
             code: 422, 
             reason: 'ValidationError', 
             message: 'Missing field',
             location: missingField
            });
     }

     const stringFields = ['user_loginidemail', 'user_password', 'user_fname', 'user_lname'];
     const nonStringField = stringFields.find(
         field => field in req.body && typeof req.body[field] != 'string'
     );
     if (nonStringField) {
         return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Incorrect field type: expected a string',
            location: nonStringField 
        }); 
     }

     const explicitlyTrimmedFields = ['user_loginidemail', 'user_password'];
     const nonTrimmedField = explicitlyTrimmedFields.find(
         field => req.body[field].trim() !== req.body[field]
     );
     if (nonTrimmedField) {
         return res.status(422).json({
             code: 422,
             reason: 'ValidationError',
             message: 'Cannot start or end with whitespace',
             location: nonTrimmedField
         });
     }

    const sizedFields = {
        user_loginidemail: {
            min: 1
        },
        user_password: {
            min: 7,
            max: 20
        }
    };
    const tooSmallField = Object.keys(sizedFields).find(
        field =>
        'min' in sizedFields[field] &&
        req.body[field].trim().length < sizedFields[field].min
    );
    const tooLargeField = Object.keys(sizedFields).find(
        field =>
        'max' in sizedFields[field] &&
        req.body[field].trim().length > sizedFields[field].max
    );
    if (tooSmallField || tooLargeField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: tooSmallField
                ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
                : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
                location: tooSmallField || tooLargeField
        });
    }

    let {user_loginidemail, user_password, user_fname = '', user_lname = ''} = req.body;
    user_fname = user_fname.trim();
    user_lname = user_lname.trim();

    // does the user already exist?
    return User.find({user_loginidemail})
        .count()
        .then(count => {
            if (count > 0) {
                return Promise.reject({
                    code: 422,
                    reason: 'ValidationError',
                    message: 'Username already taken',
                    location: 'user_loginidemail'
                });
            }
            return User.hashPassword(user_password);
        })
        .then(hash => {
            return User.create({
                user_loginidemail,
                user_password: hash,
                user_fname,
                user_lname
            });
        })
        .then(user => {
            return res.status(201).json(user.serialize());
        })
        .catch(err => {
            // forward any validation errors to client, otherwise, status: 500
            if (err.reason === 'ValidationError') {
                return res.status(err.code).json(err);
            }
            res.status(500).json({ error: 'Something went wrong!'})
        });
});

// get all users
userRouter.get('/', (req, res) => {
    User.find()
        .then(users => res.status(200).json(users.map(user => user.serialize())))
        .catch(err => res.status(500).json({ error: 'something went wrong!' }));
});

module.exports = {userRouter};