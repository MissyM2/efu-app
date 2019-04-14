'use strict';

const express = require('express');
const passport = require('passport');

const {course, courseJoiSchema} = require('../models/course.model');
const {User} = require('../models/user.model');
const Joi = require('joi');

const courseRouter = express.Router();
courseRouter.use("/", passport.authenticate('jwt', { session: false }));

// add a new course
courseRouter.post('/', (req, res) => {
    const reqFields = ['user','course_name'];
    const missingField = reqFields.find(field => !(field in req.body));
    if (missingField) {
        return res.status(422).json({code: 422, reason: 'ValidationError', message: 'Missing field', location: missingField});
    }

    const newCourse = {
        user: req.user.id,
        course_name: req.body.course_name
    };

    const validation = Joi.validate(newcourse, courseJoiSchema);
    if (validation.error){
        return res.status(400).json({error: validation.error});
    }
   
    User.findOne({usercourse_name: req.user.usercourse_name})
        .then(user => {
            newcourse.user = user._id;
            course.create(newcourse)
            .then(course => {
                res.status(201).json(course.serialize(user));
            })
            .catch(err => {
                res.status(500).json({ error: 'Something went wrong!'})
            });
        });
    
    });


// get all coursees
courseRouter.get('/', (req, res) => {
    Course.find()
        .populate('user')
        .sort({ course_name: -1} )
        .then( coursees => {
            res.status(200).json(coursees.map(course => course.serialize()))
        })
        .catch(err => {
            res.status(500).json({ error: 'something went wrong!' })
        });
});

// retrieve one course by id
courseRouter.get('/:id', (req, res) => {
    Course.findById(req.params.id)
        .then(course => {
            res.json(course.serialize())
        })
        .catch(err => {
            res.status(500).json({ error: 'something went wrong!' })
        });
});

// test for getting all coursees for user
courseRouter.get('/')

// retrieve all course for the logged in user
courseRouter.get('/:id', (req, res) => {
    Course.findById(req.params.id)
        .then(course => {
            res.json(course.serialize())
        })
        .catch(err => {
            res.status(500).json({ error: 'something went wrong!' })
        });
});

// update course by id
courseRouter.put('/:id', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        return res.status(400).json({ error: 'Request path id and request body id values must match' });
    }
    const courseUpdate = {course_name: req.body.course_name};
    const validation = Joi.validate(courseUpdate, courseJoiSchema);
    if (validation.error) {
        return response.status(400).json({error: validation.error});
    }

    const updated = {};
    const updateableFields = ['course_name', 'num', 'desc'];
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
            res.status(500).json({ error: 'something went wrong!' })
        });
    });

//  remove course by id
courseRouter.delete('/:id', (req, res) => {
    return Course.findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(200).json({success: 'course has been removed'})
        })
        .catch(err => {
            res.status(500).json({ error: 'something went wrong!' })
        });
});

module.exports = {courseRouter};