'use strict';

const express = require('express');

const { jwtPassportMiddleware } = require('../auth/auth.user');
const {User} = require('./models/user.model');

const userRouter = express.Router();

// add a new user
userRouter.post('/', jwtPassportMiddleware, (req, res) => {
    const newUser = {
        fname: req.body.user_fname,
        lname: req.body.user_lname,
        loginid: req.body.user_loginid_email,
        password: req.body.user_password
    }
    const reqFields = ['newUser.fname', 'newUser.lname', 'newUser.loginid', 'newUser.password'];
    for (let i=0; i <reqFields.length; i++) {
        const field = reqFields[i];
            if(!(field in req.body)) {
                const message = `Missing \`${field}\` in request body`;
                console.error(message);
                return res.status(400).send(message);
            }
    }
    // does the user already exist?
    return User.findOne({
        $or: [
            {user_loginid_email: newUser.loginid}
        ]
    }).then(user => {
        if (user) {
            return Response.status(400).json({ error: 'Database Error:  A user that that email/loginid already exists.'});
        }
        return User.hashpassword(newUser.password);
    }).then(passwordHash => {
        newUser.password = passwordHash;
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
userRouter.get('/', jwtPassportMiddleware, (req, res) => {
    User.find()
        .sort({ user_lname: -1} )
        .then(users => res.status(200).json(users.map(user => user.serialize())
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

// retrieve one user by user_id
userRouter.get('/:userid', jwtPassportMiddleware, (req, res) => {
    User.findById(req.params.userid)
        .then(user => res.json(user.serialize()))
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' })
        })
});

// update user by user_type
userRouter.put('/:loginid', jwtPassportMiddleware, (req, res) => {
    if (!(req.params.user_loginid_email && req.body.user_loginid_email && req.params.user_loginid_email === req.body.user_loginid_email)) {
        return res.status(400).json({ error: 'Request path id and request body id values must match' });
    }

    const updated = {};
    const updateableFields = ['user_fname', 'user_lname', 'user_loginid_email', 'user_password'];

    updateableFields.forEach(field => {
        if(field in req.body) {
            updated[field] = req.body[field];
        }
    });

    User.findByIdAndUpdate(req.params.user_loginid_email, {$set: updated}, {new: true})
        .then(updateduser => {
            return res.status(204).end();
        })
        .catch(err =>  {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

//  remove user by id
userRouter.delete('/:loginid', jwtPassportMiddleware, (req, res) => {
    return User.findByIdAndRemove(req.params.user_loginid_email)
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