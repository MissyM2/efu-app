'use strict';

const express = require('express');
const Joi = require('joi');
const passport = require('passport');

const {User} = require('../models/user.model');
const {Week, WeekJoiSchema} = require('../models/week.model');

const weekRouter = express.Router();
weekRouter.use('/', passport.authenticate('jwt', { session: false }));

// add a new week
weekRouter.post('/', (req, res) => {

    const reqFields = ['weekNum', 'startDate', 'endDate'];
    const missingField = reqFields.find(field => !(field in req.body));
    if (missingField) {
        return res.status(422).json({
            code: 422, 
            reason: 'ValidationError', 
            message: 'Missing field', 
            location: missingField
        });
    }

    const newWeek = {
        weekNum: req.body.weekNum,
        startDate: req.body.startDate,
        endDate: req.body.endDate
    };

    const validation = Joi.validate(newWeek, WeekJoiSchema);
    if (validation.error){
        return res.status(400).json({error: validation.error});
    }

    User.findById(req.user.id)
        .then(user => {
            if (user) {
                newWeek.user = user._id;
                Week.find({user: user._id, weekNum:req.body.weekNum})
                    .count()
                    .then(count => {
                        if (count > 0) {
                            return Promise.reject({
                                code: 422,
                                reason: 'ValidationError',
                                message: 'Week weekNumber already exists',
                                location: 'weekNum'
                            });
                        }
                    })
                    .then(() => {
                        return Week.create(newWeek)
                        .then(week => {
                            return res.status(201).json({
                                id: week._id,
                                studentFullName: `${user.firstName} ${user.lastName}`,
                                studentUserName: `${user.username}`,
                                weekNum: week.weekNum,
                                startDate: week.startDate,
                                endDate: week.endDate
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


// get all weeks
weekRouter.get('/', (req, res) => {
    User.findById(req.user.id)
        .then(user => {
            Week.find({user: user._id})
                .populate('User')
                .then( weeks => {
                    res.status(200).json(weeks.map(week => week.serialize()));
                })
                .catch(err => {
                    console.error(err);
                    return res.status(500).json({ error: `${err}` });
                });
        })
});
 

module.exports = {weekRouter};