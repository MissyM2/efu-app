'use strict';

const express = require('express');
const Joi = require('joi');
const passport = require('passport');

const {User, UserJoiSchema} = require('../models/user.model');

const userRouter = express.Router();
userRouter.use("/", passport.authenticate('local', { session: false }));


// add a new user
userRouter.post('/', (req, res) => {

     // check that all req fields are present 
     const reqFields = ['user_fname', 'user_lname', 'user_loginidemail', 'user_password'];
     const missingField = reqFields.find(field => !(field in req.body));
     if (missingField) {
         return res.status(422).json({code: 422, reason: 'ValidationError', message: 'Missing field', location: missingField});
     }

    // create object with request items
    const newUser = {
        user_fname: req.body.user_fname,
        user_lname: req.body.user_lname,
        user_loginidemail: req.body.user_loginidemail,
        user_password: req.body.user_password
    }

    // validation
    const validation = Joi.validate(newUser, UserJoiSchema);
    console.log(validation)
    console.log(validation.error);
    if (validation.error){
        return Response.status(400).json({error: validation.error});
    }

    // does the user already exist?
    return User.findOne({
        $or: [
            {user_loginidemail: newUser.loginidemail}
        ]
    }).then(user => {
        if (user) {
            return Response.status(400).json({ error: 'Database Error:  A user that that email/loginid already exists.'});
        }
        return User.hashPassword(newUser.user_password);
    }).then(passwordHash => {
        newUser.user_password = passwordHash;
        User.create(newUser)
            .then(newUser => {
                return res.status(201).json(newUser.serialize());
            })
            .catch(err => {
                // forward any validation errors to client, otherwise, status: 500
                if (err.reason === 'ValidationError') {
                    return res.status(err.code).json(err);
                }
                res.status(500).json({ error: 'Something went wrong!'})
            });
            
        });
});


// get all users
userRouter.get('/', (req, res) => {
    User.find()
        .sort({ user_lname: -1} )
        .then(users => res.status(200).json(users.map(user => user.serialize())))
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

// retrieve one user by user_loginidemail
userRouter.get('/:user_loginidemail', (req, res) => {
    User.find({"user_loginidemail": req.params.user_loginidemail})
        .then(users => res.status(200).json(users.map(user => user.serialize())))
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' })
        })
});

// update user by user_type
userRouter.put('/:user_loginidemail', (req, res) => {

    // check for existence of params.id and body.id and if they match
    if (!(req.params.user_loginidemail && req.body.user_loginidemail && req.params.user_loginidemail === req.body.user_loginidemail)) {
        return res.status(400).json({ error: 'Request path id and request body id values must match' });
    }

     // create object with updated fields
    const userUpdate = {
        user_fname: req.body.user_fname,
        user_lname: req.body.user_lname,
        user_loginidemail: req.body.user_loginidemail
    };
    console.log('userUpdate is', userUpdate);

    // validate fields with Joi
    const validation = Joi.validate(userUpdate, UserJoiSchema);
    if (validation.error) {
        return response.status(400).json({error: validation.error});
    }

    //  find fields to be updated
    const updated = {};
    const updateableFields = ['user_fname', 'user_lname'];
    updateableFields.forEach(field => {
        if(field in req.body) {
            updated[field] = req.body[field];
        }
    });
    console.log(updated);

    // find user and update the document
    User.find({"user_loginidemail": req.params.user_loginidemail}, {$set: updated}, {new: true})
        .then(updateduser => {
            return res.status(204).end();
        })
        .catch(err =>  {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

//  remove user by id
userRouter.delete('/:user_loginidemail', (req, res) => {
    return User.findOneAndRemove({"user_loginidemail": req.params.user_loginidemail})
        .then(() => {
            console.log('deleting entry...');
            return res.status(204).end();
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

module.exports = {userRouter};