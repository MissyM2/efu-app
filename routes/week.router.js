'use strict';

const express = require('express');
const passport = require('passport');

const {User} = require('../models/user.model');
const {Term} = require('../models/term.model');
const {Week} = require('../models/week.model');

const weekRouter = express.Router();
weekRouter.use('/', passport.authenticate('jwt', { session: false }));

// add a new week
weekRouter.post('/', (req, res) => {
    const reqFields = ['termDesc','weekNum'];
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
        likedLeast: req.body.likedLeast,
        likedMost: req.body.likedMost,
        mostDifficult: req.body.mostDifficult,
        leastDifficult: req.body.leastDifficult
    };

    User.findById(req.user.id)
        .then(user => {
            if (user) {
                newWeek.user = user._id;
                Term.findOne({termDesc: req.body.termDesc})
                    .then(term => {
                        if (term) {
                            newWeek.term = term._id;
                            console.log('newWeek with term is ', newWeek);
                            return Week.create(newWeek)
                                .then(week => {
                                    return res.status(201).json({
                                        id: week._id,
                                        studentFullName: `${user.firstName} ${user.lastName}`,
                                        termDesc: term.termDesc,
                                        weekNum: week.weekNum,
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





// update a week id for the logged in user
weekRouter.put('/', (req, res) => {
   const reqFields = ['termDesc', 'weekNum'];

    const updatedWeek = {};
    console.log('before fields are added', updatedWeek);
    const updateableFields = ['likedLeast', 'likedMost', 'mostDifficult', 'leastDifficult'];
    updateableFields.forEach(field => {
        if (field in req.body) {
            updatedWeek[field] = req.body[field];
        }
    });

    console.log('updateableFields are ', updateableFields);
    console.log('updatedWeek is ', updatedWeek);

    User.findById(req.user.id)
        .then(user => {
            if (user) {
                updatedWeek.user = user._id;
                Term.findOne({termDesc: req.body.termDesc})
                    .then(term => {
                        if (term) {
                            updatedWeek.term = term._id;
                            Week.findOne({user:user._id, term:term._id, weekNum: req.body.weekNum})
                                .then(week => {
                                    if (week) {
                                        updatedWeek.week = week._id;
                                        Week.findOneAndUpdate({_id: week._id}, updatedWeek, {new: true})
                                            .then(updatedweek => {
                                                console.log('we made it to then');
                                                res.status(200).json(updatedweek);
                                            })
                                            .catch(err => {
                                                console.error(err);
                                                return res.status(500).json({error: `${err}`});
                                            });
                                    } else {
                                        const message = 'week not found';
                                        console.error(message);
                                        return res.status(400).send(message);
                                    }
                                })
                                .catch(err => {
                                    console.error(err);
                                    return res.status(500).json({error: `${err}`});
                                }); 
                        } else {
                            const message = `term not found`;
                            console.error(message);
                            return res.status(400).send(message);
                        }
                    })
                    .catch (err => {
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


 //update details of the week by weekNum
weekRouter.put('/:weekNum', (req, res) => {
    const weekUpdate = {
        weekNum: req.body.weekNum,
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