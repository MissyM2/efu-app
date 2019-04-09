'use strict';

const express = require('express');

//const { jwtPassportMiddleware } = require('../auth/auth.user');
const {User} = require('../models/user.model');

const userRouter = express.Router();

// add a new user
userRouter.post('/', (req, res) => {
    const newUser = {
        user_fname: req.body.user_fname,
        user_lname: req.body.user_lname,
        user_loginidemail: req.body.user_loginidemail,
        user_password: req.body.user_password
    }

    console.log('new user is ' + newUser.body);

   // const reqFields = ['newUser.user_fname', 'newUser.user_lname', 'newUser.user_loginidemail', 'newUser.user_password'];
   // for (let i=0; i <reqFields.length; i++) {
   //     const field = reqFields[i];
    //        if(!(field in req.body)) {
    //            console.error(message);
     //           return res.status(400).send(message);
     //
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
        console.log(newUser);
        User.create(newUser)
            .then(newUser => {
                return res.status(201).json(newUser.serialize());
            })
            .catch(err => {
                console.error(err);
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

// retrieve one user by user_id
userRouter.get('/:userid', (req, res) => {
    User.findById(req.params.userid)
        .then(user => res.json(user.serialize()))
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' })
        })
});

// update user by user_type
userRouter.put('/:id', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        return res.status(400).json({ error: 'Request path id and request body id values must match' });
    }

    const updated = {};
    const updateableFields = ['user_fname', 'user_lname', 'user_loginidemail', 'user_password'];

    updateableFields.forEach(field => {
        if(field in req.body) {
            updated[field] = req.body[field];
        }
    });

    User.findByIdAndUpdate(req.params.user_loginidemail, {$set: updated}, {new: true})
        .then(updateduser => {
            return res.status(204).end();
        })
        .catch(err =>  {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

//  remove user by id
userRouter.delete('/:loginid', (req, res) => {
    return User.findByIdAndRemove(req.params.user_loginidemail)
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