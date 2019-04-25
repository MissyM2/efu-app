'use strict';

const express = require('express');
const Joi = require('joi');
const passport = require('passport');

const {User} = require('../models/user.model');
const {Term, TermJoiSchema} = require('../models/term.model');

const termRouter = express.Router();
termRouter.use('/', passport.authenticate('jwt', { session: false }));

// add a new term
termRouter.post('/', (req, res) => {

    const reqFields = ['termDesc'];
    const missingField = reqFields.find(field => !(field in req.body));
    if (missingField) {
        return res.status(422).json({
            code: 422, 
            reason: 'ValidationError', 
            message: 'Missing field', 
            location: missingField
        });
    }

    const newTerm = {
        termDesc: req.body.termDesc
    };

    const validation = Joi.validate(newTerm, TermJoiSchema);
    if (validation.error){
        return res.status(400).json({error: validation.error});
    }

    User.findById(req.user.id)
        .then(user => {
            if (user) {
                newTerm.user = user._id;
                Term.find({user: user._id, termDesc:req.body.termDesc})
                    .count()
                    .then(count => {
                        if (count > 0) {
                            return Promise.reject({
                                code: 422,
                                reason: 'ValidationError',
                                message: 'term termDesc already exists',
                                location: 'termDesc'
                            });
                        }
                    })
                    .then(() => {
                        return Term.create(newTerm)
                        .then(term => {
                            return res.status(201).json({
                                id: term._id,
                                studentFullName: `${user.firstName} ${user.lastName}`,
                                studentUserName: `${user.username}`,
                                termDesc: term.termDesc
                            })
                        })
                        .catch(err => {
                            console.error(err);
                            res.status(500).json({ error: `${err}`});
                        });
                    });
                } else {
                    const message = `user not found`;
                    console.error(message);
                    return res.status(400).send(message);
                }
            })
            .catch(err => {
                console.error(err);
                return res.status(500).json({error: `${err}`});
            });
});


// get all terms
termRouter.get('/', (req, res) => {
    User.findById(req.user.id)
        .then(user => {
            Term.find({user: user._id})
                .populate('User')
                .then( terms => {
                    res.status(200).json(terms.map(term => term.serialize()));
                })
                .catch(err => {
                    console.error(err);
                    return res.status(500).json({ error: `${err}` });
                });
        })
});

// get term by id
termRouter.get('/:id', (req, res) => {
    User.findById(req.user.id)
        .then(user => {
            if (user) {
                Term.find({user: user._id, id: req.params.id})
                    .then( terms => {
                        console.log(terms);
                        return res.status(200).json(terms.map(term => term.serialize()));
                    })
                    .catch(err => {
                        console.error(err);
                        return res.status(500).json({ error: `${err}` });
                    });
            } else {
                const message = `user not found`;
                console.error(message);
                return res.status(400).send(message);
            }
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: `${err}`});
        });         
});
 

module.exports = {termRouter};