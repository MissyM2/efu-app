'use strict';

const express = require('express');
const passport = require('passport');

const {User} = require('../models/user.model');
const {Week} = require('../models/week.model');
const {Course} = require('../models/course.model');
const {PlanofAction} = require('../models/planofaction.model');


const planofactionRouter = express.Router();
planofactionRouter.use('/', passport.authenticate('jwt', {session: false}));


// add a new deliverable for a given course
planofactionRouter.post('/', (req, res) => {
    const reqFields = ['weekNum', 'deliverableName'];
    const missingField = reqFields.find(field => !(field in req.body));
    if (missingField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing field',
            location: missingField
        });
    }

    const newPlanofAction = {
            prepDate1: req.body.prepDate1,
            prepHrs1: req.body.prepHrs1,
            prepDate2: req.body.prepDate2,
            prepHrs2: req.body.prepHrs2,
            prepDate3: req.body.prepDate3,
            prepHrs3: req.body.prepHrs3,
            prepDate4: req.body.prepDate4,
            prepHrs4: req.body.prepHrs4,
    };
    
    

    User.findById(req.user.id)
        .then(user => {
            if (user) {
                newPlanofAction.user = user._id;
                Week.findOne({user:user._id, weekNum: req.body.weekNum})
                    .then(week => {
                        if (week) {
                            newPlanofAction.week = week._id;
                            return PlanofAction.create(newPlanofAction)
                                .then(planofaction => {
                                    return res.status(201).json({
                                        id: planofaction._id,
                                        studentFullName: `${user.firstname} ${user.lastname}`,
                                        weekNum: week.weekNum,
                                        prepDate1: planofaction.prepDate1,
                                        prepHrs1: planofaction.prepHrs1,
                                        prepDate2: planofaction.prepDate2,
                                        prepHrs2: planofaction.prepHrs2,
                                        prepDate3: planofaction.prepDate3,
                                        prepHrs3: planofaction.prepHrs3,
                                        prepDate4: planofaction.prepDate4,
                                        prepHrs4: planofaction.prepHrs4,
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


// get all deliverables for selected user
planofactionRouter.get('/', (req, res) => {
    console.log(req.user.id);
    User.findById(req.user.id)
        .then (user => {
            Deliverable.find({user: user._id})
                .then(deliverables => {
                    res.status(200).json(
                        deliverables.map(deliverable => deliverable.serialize())
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


module.exports = {planofactionRouter};