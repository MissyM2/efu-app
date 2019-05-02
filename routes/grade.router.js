'use strict';

const express = require('express');
const passport = require('passport');

const {User} = require('../models/user.model');
const {Term} = require('../models/term.model');
const {Course} = require('../models/course.model');
const {Week} = require('../models/week.model');
const {Grade} = require('../models/grade.model');


const gradeRouter = express.Router();
gradeRouter.use('/', passport.authenticate('jwt', {session: false}));


// add a new Grade for a given course
gradeRouter.post('/', (req, res) => {
    const reqFields = ['termDesc','courseName','weekNum', 'gradeNum'];
    const missingField = reqFields.find(field => !(field in req.body));
    if (missingField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing field',
            location: missingField
        });
    }

    const newGrade = {
            gradeNum: req.body.gradeNum
    };
    
    User.findById(req.user.id)
        .then(user => {
            if (user) {
                newGrade.user = user._id;
                // now that the user is found, find the term
                Term.findOne({termDesc: req.body.termDesc})
                    .then(term => {
                        if (term) {
                            newGrade.term = term._id;
                            console.log('newGrade with userid is', newGrade);

                            // now that the user and term are found, find the week
                            Week.findOne({user:user._id, weekNum: req.body.weekNum})
                                .then(week => {
                                    if (week) {
                                        newGrade.weekNum = week._id;
                                        console.log('newGrade with userid, weekid is', newGrade);
                                        // now that user, term and week are found, find course
                                        Course.findOne({user:user._id, courseName: req.body.courseName})
                                        .then(course => {
                                            if (course) {
                                                newGrade.courseName = course._id;
                                                console.log('newGrade with userid, weekid, courseid is', newGrade);
                                                // now that all req fields (user, term, week and course are found, create grade)
                                                return Grade.create(newGrade)
                                                    .then(grade => {
                                                        return res.status(201).json({
                                                            id: grade._id,
                                                            studentFullName: `${user.firstname} ${user.lastname}`,
                                                            termDesc: term.termDesc,
                                                            weekNum: week.weekNum,
                                                            courseName: course.courseName,
                                                            gradeNum: grade.gradeNum
                                                        })
                                                    })
                                                    .catch(err => {
                                                        console.error(err);
                                                        return res.status(500).json({error: `${err}`});
                                                    });
                                            } else {
                                                const message = `course not found`;
                                                console.error(message);
                                                return res.status(400).send(message);
                                            }
                                        })
                                        .catch(err => {
                                            console.error(err);
                                            return res.status(500).json({ error: `${err}`});
                                        });

                                    } else {
                                        const message = `week not found`;
                                        console.error(message);
                                        return res.status(400).send(message);
                                    }
                                })
                                .catch (err => {
                                    console.error(err);
                                    return res.status(500).json({ error: `${err}`});
                                });
                        } else {
                            const message = `term not found`;
                            console.error(message);
                            return res.status(500).send(message);
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        return res.status(500).json({ error: `${err}`});
                    });
            } else {
                const message = `user not found`;
                console.error(message);
                return res.status(500).send(message);
            }
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: `${err}`});
        });
});


// get all Grades for selected user
gradeRouter.get('/', (req, res) => {
    console.log(req.user.id);
    User.findById(req.user.id)
        .then (user => {
            Grade.find({user: user._id})
                .then(Grades => {
                    res.status(200).json(
                        Grades.map(Grade => Grade.serialize())
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

// update a Grade for a given course, for a given week, for a given term for a given user
gradeRouter.post('/', (req, res) => {
    const reqFields = ['termDesc','courseName','weekNum', 'gradeNum'];
    const missingField = reqFields.find(field => !(field in req.body));
    if (missingField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing field',
            location: missingField
        });
    }

    const newGrade = {
            gradeNum: req.body.gradeNum
    };
    
    User.findById(req.user.id)
        .then(user => {
            if (user) {
                newGrade.user = user._id;
                // now that the user is found, find the term
                Term.findOne({termDesc: req.body.termDesc})
                    .then(term => {
                        if (term) {
                            newGrade.term = term._id;
                            console.log('newGrade with userid is', newGrade);

                            // now that the user and term are found, find the week
                            Week.findOne({user:user._id, weekNum: req.body.weekNum})
                                .then(week => {
                                    if (week) {
                                        newGrade.weekNum = week._id;
                                        console.log('newGrade with userid, weekid is', newGrade);
                                        // now that user, term and week are found, find course
                                        Course.findOne({user:user._id, courseName: req.body.courseName})
                                        .then(course => {
                                            if (course) {
                                                newGrade.courseName = course._id;
                                                console.log('newGrade with userid, weekid, courseid is', newGrade);
                                                // now that all req fields (user, term, week and course are found, create grade)
                                                return Grade.create(newGrade)
                                                    .then(grade => {
                                                        return res.status(201).json({
                                                            id: grade._id,
                                                            studentFullName: `${user.firstname} ${user.lastname}`,
                                                            termDesc: term.termDesc,
                                                            weekNum: week.weekNum,
                                                            courseName: course.courseName,
                                                            gradeNum: grade.gradeNum
                                                        })
                                                    })
                                                    .catch(err => {
                                                        console.error(err);
                                                        return res.status(500).json({error: `${err}`});
                                                    });
                                            } else {
                                                const message = `course not found`;
                                                console.error(message);
                                                return res.status(400).send(message);
                                            }
                                        })
                                        .catch(err => {
                                            console.error(err);
                                            return res.status(500).json({ error: `${err}`});
                                        });

                                    } else {
                                        const message = `week not found`;
                                        console.error(message);
                                        return res.status(400).send(message);
                                    }
                                })
                                .catch (err => {
                                    console.error(err);
                                    return res.status(500).json({ error: `${err}`});
                                });
                        } else {
                            const message = `term not found`;
                            console.error(message);
                            return res.status(500).send(message);
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        return res.status(500).json({ error: `${err}`});
                    });
            } else {
                const message = `user not found`;
                console.error(message);
                return res.status(500).send(message);
            }
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: `${err}`});
        });
});


module.exports = {gradeRouter};