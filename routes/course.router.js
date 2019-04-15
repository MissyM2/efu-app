'use strict';

const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');

const {User} = require('../models/user.model');
const {Course, CourseJoiSchema} = require('../models/course.model');

const Joi = require('joi');

const courseRouter = express.Router();
courseRouter.use("/", passport.authenticate('jwt', { session: false }));  //this is where we are getting the user.id


// add a new course for a given user
courseRouter.post('/', (req, res) => {
    // because the user is already authenticated,
    //  can use req.user.id because user.id is already on the req so you don't have to send on the body or params
    const newCourse = {
        courseName: req.body.courseName
    }
    console.log('new course is ', newCourse);
    const reqFields = ['courseName'];
    const missingField = reqFields.find(field => !(field in req.body));
    if (missingField) {
        return res.status(422).json({code: 422, 
            reason: 'ValidationError', 
            message: 'Missing field', 
            location: missingField
        });
    }
    console.log('passed missing fields');

    const validation = Joi.validate(newCourse, CourseJoiSchema);
    if (validation.error){
        return res.status(400).json({error: validation.error});
    }

    console.log('passed validation');

    // it is req.user.id because i am getting this from the authentication
    User.findById(req.user.id)
            .then(user => {
                if (user) {
                    newCourse.user = user._id;
                    console.log(newCourse);
                    Course.create(newCourse)
                        .then(course => {
                            console.log('course is ', course);
                            console.log('user is ', req.user );
                            return res.status(201).json({
                                id: course._id,
                                user: `${user.firstname} ${user.lastname}`,
                                courseName: course.courseName
                            })
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
                return res.status(500).json({ error: `${err}`});
            });
});


// get all coursees
courseRouter.get('/', (req, res) => {
    console.log(req.user.id);
    User.findById(req.user.id)
        .then (user => {
            console.log(user);
            Course.find({user: user._id})
            .populate('User')
            .then( courses => {
                console.log(courses);
                res.status(200).json(courses);
            })
            .catch(err => {
                console.log(err);
                return res.status(500).json({ error: `${err}` });
            });
        })
    
});

// retrieve one course by courseName
courseRouter.get('/:courseName', (req, res) => {
    console.log('did i make it here?');
    Course.find({courseName: req.params.courseName})
        .then(courses => {
            console.log(courses);
                return res.status(200).json(courses.map(course => course.serialize()));
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ error: `${err}` })
        });
});

// retrieve all course for the logged in user
courseRouter.get('/:id', (req, res) => {
    Course.findById(req.params.id)
        .then(course => {
            res.json(course.serialize())
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ error: `${err}` })
        });
});

// update course by id
courseRouter.put('/:id', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        return res.status(400).json({ error: 'Request path id and request body id values must match' });
    }
    const courseUpdate = {courseName: req.body.courseName};
    const validation = Joi.validate(courseUpdate, courseJoiSchema);
    if (validation.error) {
        return response.status(400).json({error: validation.error});
    }

    const updated = {};
    const updateableFields = ['courseName', 'num', 'desc'];
    updateableFields.forEach(field => {
        if(field in req.body) {
            updated[field] = req.body[field];
        }
    });

    Course.findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
        .then(updatedcourse => {
            res.status(200).json(updatedcourse.serialize())
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ error: `${err}` })
        });
    });

//  remove course by courseName
courseRouter.delete('/:courseName', (req, res) => {
    return Course.deleteMany({"courseName": req.params.courseName})
        .then(() => {
            res.status(200).json({success: 'course has been removed'})
        })
        .catch(err => {
            res.status(500).json({ error: 'something went wrong!' })
        });
});

module.exports = {courseRouter};