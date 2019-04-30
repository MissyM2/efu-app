'use strict';

const express = require('express');
const passport = require('passport');

const {User} = require('../models/user.model');
const {Term} = require('../models/term.model');
const {Course} = require('../models/course.model');
const {Week} = require('../models/week.model');
const {Deliverable} = require('../models/deliverable.model');



const deliverableRouter = express.Router();
deliverableRouter.use('/', passport.authenticate('jwt', {session: false}));


// add a new deliverable for a given course
deliverableRouter.post('/', (req, res) => {
    const reqFields = ['termDesc', 'weekNum', 'courseName', 'dueDate', 'deliverableName', 'pressure', 'prephrs'];
    const missingField = reqFields.find(field => !(field in req.body));
    if (missingField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing field',
            location: missingField
        });
    }

    const newDeliverable = {
            dueDate: req.body.dueDate,
            deliverableName: req.body.deliverableName,
            pressure: req.body.pressure,
            desc: req.body.desc,
            prephrs: req.body.prephrs
    };
    

    User.findById(req.user.id)
        .then(user => {
            if (user) {
                newDeliverable.user = user._id;
                console.log('newDeliverable with userid is', newDeliverable);
                Term.findOne({termDesc: req.body.termDesc})
                    .then(term => {
                        if (term) {
                            newDeliverable.term = term._id;
                            console.log('newDeliverable with termid is', newDeliverable);
                            Week.findOne({user:user._id, term: term._id, weekNum:req.body.weekNum })
                                .then(week => {
                                    if (week) {
                                        newDeliverable.week = week._id;
                                        console.log('newDeliverable with weekid is', newDeliverable);
                                        Course.findOne({user:user._id, term: term._id, courseName: req.body.courseName})
                                            .then(course => {
                                                if (course) {
                                                    newDeliverable.course = course._id;
                                                    console.log('newDeliverable with courseid ', newDeliverable);
                                                    return Deliverable.create(newDeliverable)
                                                        .then(deliverable => {
                                                            return res.status(201).json({
                                                                id: deliverable._id,
                                                                studentFullName: `${user.firstname} ${user.lastname}`,
                                                                termDesc: term.termDesc,
                                                                weekNum: week.weekNum,
                                                                courseName: course.courseName,
                                                                dueDate: deliverable.dueDate,
                                                                deliverableName: deliverable.deliverableName,
                                                                pressure: deliverable.pressure,
                                                                desc: deliverable.desc,
                                                                prephrs: deliverable.prephrs
                                                            });
                                                        })
                                                        .catch(err => {
                                                            console.error(err);
                                                            return res.status(500).json({error: `${err}`});
                                                        });
                                                } else {
                                                    const message = `course not found`;
                                                    console.error(message);
                                                    return res.status(400).send(message);
                                                };
                                            })
                                            .catch(err => {
                                                console.error(err);
                                                return res.status(500).json({error: `${err}`});
                                            })
                                    } else {
                                        const message = `week not found`;
                                        console.error(message);
                                        return res.status(400).send(message);
                                    };
                                })
                                .catch(err => {
                                    console.error(err);
                                    return res.status(500).json({error: `${err}`});
                                })     
                        } else {
                            const message = `term not found`;
                            console.error(message);
                            return res.status(400).send(message);
                        };
                    })
                    .catch(err => {
                        console.error(err);
                        return res.status(500).json({ error: `${err}`});
                    })

            } else {
                const message = `user not found`;
                console.error(message);
                return res.status(400).send(message);
            }
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: `${err}`});
        });
});


// get all deliverables for selected user
// deliverables for course and week are handled on the front-end in the component
deliverableRouter.get('/', (req, res) => {
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


module.exports = {deliverableRouter};