'use strict';

const express = require('express');
const Joi = require('joi');
const passport = require('passport');

const {User} = require('../models/user.model');
const {Term} = require('../models/term.model');
const {Course, CourseJoiSchema} = require('../models/course.model');

const courseRouter = express.Router();
courseRouter.use("/", passport.authenticate('jwt', { session: false }));  //this is where we are getting the user.id


// add a new course for a given user
courseRouter.post('/', (req, res) => {
    const reqFields = ['termDesc','courseName'];
    const missingField = reqFields.find(field => !(field in req.body));
    if (missingField) {
        return res.status(422).json({code: 422, 
            reason: 'ValidationError', 
            message: 'Missing field', 
            location: missingField
        });
    }

    const newCourse = {
        courseName: req.body.courseName
    }
    
    const validation = Joi.validate(newCourse, CourseJoiSchema);
    if (validation.error){
        return res.status(400).json({error: validation.error});
    }

    User.findById(req.user.id)
    .then(user => {
        if (user) {
            newCourse.user = user._id;
            Term.findOne({user: user._id, termDesc: req.body.termDesc})
                .then(term => {
                    if (term) {
                        newCourse.term = term._id;
                        return Course.create(newCourse)
                            .then(course => {
                                return res.status(201).json({
                                    id: course._id,
                                    studentFullName: `${user.firstName} ${user.lastName}`,
                                    studentUserName: `${user.username}`,
                                    termDesc: term.termDesc,
                                    courseName: course.courseName
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



// get all courses by term by user
//working on this!
courseRouter.get('/:term', (req, res) => {
    User.findById(req.user.id)
        .then (user => {
            Term.findOne({user:user._id, term: req.params.term})
                .then(term => {
                    Course.find({user: user._id, term: term._id})
                    .populate('User')
                    .then( courses => {
                        res.status(200).json(courses.map(course => course.serialize()));
                    })
                    .catch(err => {
                        console.log(err);
                        return res.status(500).json({ error: `${err}` });
                    });
                })
            
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
    const validation = Joi.validate(courseUpdate, CourseJoiSchema);
    if (validation.error) {
        return response.status(400).json({error: validation.error});
    }

    Course.findByIdAndUpdate(req.params.id, {$set: courseUpdate}, {new: true})
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