'use strict';

const express = require('express');
const Joi = require('joi');
const passport = require('passport');

const {User} = require('../models/user.model');
const {Term} = require('../models/term.model');
const {Week, WeekJoiSchema} = require('../models/week.model');

const weekRouter = express.Router();
weekRouter.use('/', passport.authenticate('jwt', { session: false }));

// add a new week
weekRouter.post('/', (req, res) => {

    const reqFields = ['termDesc','weekNum', 'startDate', 'endDate'];
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
        termDesc: req.body.termDesc,
        weekNum: req.body.weekNum,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        likedLeast: req.body.likedLeast,
        likedMost: req.body.likedMost,
        mostDifficult: req.body.mostDifficult,
        leastDifficult: req.body.leastDifficult
    };

    const validation = Joi.validate(newWeek, WeekJoiSchema);
    if (validation.error){
        return res.status(400).json({error: validation.error});
    }

    User.findById(req.user.id)
        .then(user => {
            if (user) {
                newWeek.user = user._id;
                Term.findOne({user: user._id, termDesc: req.body.termDesc})
                    .then(term => {
                        if (term) {
                            newWeek.term = term._id;
                            return Week.create(newWeek)
                                .then(week => {
                                    return res.status(201).json({
                                        id: week._id,
                                        studentFullName: `${user.firstName} ${user.lastName}`,
                                        studentUserName: `${user.username}`,
                                        termDesc: term.termDesc,
                                        weekNum: week.weekNum,
                                        startDate: week.startDate,
                                        endDate: week.endDate,
                                        likedLeast: week.likedLeast,
                                        likedMost: week.likedMost,
                                        mostDifficult: week.mostDifficult,
                                        leastDifficult: week.leastDifficult
                                    });                         
                                })
                                .catch(err => {
                                    console.error(err);
                                    res.status(500).json({ error: `${err}`});
                                });
                            } else {
                                const message = `term not found`;
                                console.error(message);
                                return res.status(400).send(message);
                            }
                        })
                        .catch(err => {
                            console.error(err);
                            return res.status(500).json({error: `${err}`});
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
    console.log(req.user.id);
    User.findById(req.user.id)
        .then (user => {
            Week.find({user: user._id})
                .then(weeks => {
                    res.status(200).json(
                        weeks.map(week => week.serialize())
                    )
                })
                .catch(err => {
                    console.log(err);
                    return res.status(500).json({error: `${err}`});
                });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: `${err}`});
        });
});


/*
weekRouter.get('/:weekNum', (req, res) => {
    User.findById(req.user.id)
        .then(user => {
            if (user) {
                Week.find({user: user._id, weekNum: req.params.weekNum})
                    .then( weeks => {
                        console.log(weeks);
                        return res.status(200).json(weeks.map(week => week.serialize())
                        );
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


// update a week id for the logged in user
weekRouter.put('/:weekNum', (req, res) => {
    if (!(req.params.weekNum && req.body.weekNum && req.params.weekNum === req.body.weekNum)) {
        console.log('params.weekNum is ', req.params.weekNum)
        console.log('req.body.weekNum is ', req.body.weekNum);
        res.status(400).json({
            error: 'Request path weekNum and request body weekNum values must match'
        });
    }

    const updated = {};
    console.log(updated);
    const updateableFields = ['weekNum', 'startDate', 'endDate'];
    updateableFields.forEach(field => {
        if (field in req.body) {
            updated[field] = req.body[field];
        }
    });

    console.log('updateableFields are ', updateableFields);

    User.findById(req.user.id)
        .then(user => {
            if (user) {
                Week.find({user: user._id, weekNum: req.params.weekNum},{$set: updated}, { new: true})
                    .then(updatedWeek => {
                        res.status(200).json(updatedWeek.serialize());
                    })
                    .catch(err => {
                        console.error(err);
                        return res.status(500).json({error: `${err}`});
                    });
            } else {
                const message = `user not found`;
                console.error(message);
                return res.status(400).send(message);
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ error: `${err}`});
        });
});
 */

 //update details of the week by weekNum
weekRouter.put('/:weekNum', (req, res) => {
    const weekUpdate = {
        weekNum: req.body.weekNum,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        likedLeast: req.body.likedLeast,
        likedMost: req.body.likedMost,
        mostDifficult: req.body.mostDifficult,
        leastDifficult: req.body.leastDifficult
    };

    const validation = Joi.validate(weekUpdate, WeekJoiSchema);
    if (validation.error){
        return res.status(400).json({error: validation.error});
    }

    User.findById(req.user.id)
        .then(user => {
            if (user) {
                Term.find({user: user._id, termDesc: req.body.termDesc})
                    .then(term => {
                        if (term) {
                            Week.findOneAndUpdate(req.params.weekNum, weekUpdate)
                                .then(week => {
                                    return res.status(201).json(week)                      
                                })                               
                                .catch(err => {
                                    console.error(err);
                                    res.status(500).json({ error: `${err}`});
                                });
                        } else {
                            const message = `term not found`;
                            console.error(message);
                            return res.status(400).send(message);
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        return res.status(500).json({error: `${err}`});
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

module.exports = {weekRouter};