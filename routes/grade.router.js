'use strict';

const express = require('express');
const Joi = require('joi');
const passport = require('passport');

const {User} = require('../models/user.model');
const {Course} = require('../models/course.model');
const {Week} = require('../models/week.model');
const {Grade, GradeJoiSchema} = require('../models/Grade.model');


const GradeRouter = express.Router();
GradeRouter.use('/', passport.authenticate('jwt', {session: false}));


// add a new Grade for a given course
GradeRouter.post('/', (req, res) => {
    const reqFields = ['courseName', 'weekNum', 'gradeNum'];
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
            GradeNum: req.body.GradeNum
    };
    
    

    User.findById(req.user.id)
        .then(user => {
            if (user) {
                newGrade.user = user._id;
                Week.findOne({user:user._id, weekNum: req.body.weekNum})
                    .then(week => {
                        if (week) {
                            newGrade.weekNum = week._id;
                            Course.findOne({user:user._id, courseName: req.body.courseName})
                            .then(course => {
                                if (course) {
                                    newGrade.courseName = course._id;
                                    return Grade.create(newGrade)
                                        .then(grade => {
                                            return res.status(201).json({
                                                id: grade._id,
                                                studentFullName: `${user.firstname} ${user.lastname}`,
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
                                    const message = `grade not found`;
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
GradeRouter.get('/', (req, res) => {
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


module.exports = {GradeRouter};