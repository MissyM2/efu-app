'use strict';

const express = require('express');
const passport = require('passport');

const {User} = require('../models/user.model');
const {Term} = require('../models/term.model');
const {Course} = require('../models/course.model');

const courseRouter = express.Router();
courseRouter.use("/", passport.authenticate('jwt', { session: false }));  //this is where we are getting the user.id


// add a new course for a given user
courseRouter.post('/', (req, res) => {
    const reqFields = ['termDesc', 'courseName'];
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

    User.findById(req.user.id)
    .then(user => {
        if (user) {
            newCourse.user = user._id;
            Term.findOne({termDesc: req.body.termDesc})
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



// get all courses for selected user
courseRouter.get('/', (req, res) => {
    console.log(req.user.id);
    User.findById(req.user.id)
        .then (user => {
            Course.find({user: user._id})
                .then(courses => {
                    res.status(200).json(
                        courses.map(course => course.serialize())
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


//update given course
courseRouter.put('/', (req, res) => {
    const reqFields = [	'termDesc','oldCourseName', 'newCourseName'];
    const missingField = reqFields.find(field => !(field in req.body));
    if (missingField) {
        return res.status(422).json({code: 422, 
            reason: 'ValidationError', 
            message: 'Missing field', 
            location: missingField
        });
    }

    const updatedCourse = {
        courseName: req.body.newCourseName
    }
    console.log('updatedCourse before searching', updatedCourse);
  
    User.findById(req.user.id)
    .then(user => {
        if (user) {
            updatedCourse.user = user._id;
            console.log('updatedCourse after user is found', updatedCourse);
            Term.findOne({termDesc: req.body.termDesc}) 
                .then(term => {
                    if (term) {
                        updatedCourse.term=term._id;
                        console.log('updatedCourse after term is found', updatedCourse);
                        Course.findOne({user:user._id, term:term._id, courseName: req.body.oldCourseName})
                            .then(course => {
                                if (course) {
                                    console.log('this is the course to be updated', course);
                                    console.log({_id: course._id});
                                    console.log(course._id);
                                    Course.findOneAndUpdate({_id: course._id}, updatedCourse, {new: true})
                                        .then(newcourse => {
                                            console.log('we made it to then');
                                            res.status(200).json(newcourse);
                                        })
                                        .catch(err => {
                                            console.error(err);
                                            return res.status(500).json({error: `${err}`});
                                        });
                                } else {
                                    const message = 'course not found';
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
        res.status(500).json({error: `${err}`});
    });                   
});



module.exports = {courseRouter};