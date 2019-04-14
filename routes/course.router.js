'use strict';

const express = require('express');
const passport = require('passport');

const {Course} = require('../models/course.model');
//const {User} = require('../models/user.model');
const Joi = require('joi');

const courseRouter = express.Router();
courseRouter.use("/", passport.authenticate('jwt', { session: false }));

// add a new course for a given student
courseRouter.post('/:student_id', (req, res) => {
    const reqFields = ['student_id','course_name'];
    const missingField = reqFields.find(field => !(field in req.body));
    if (missingField) {
        return res.status(422).json({code: 422, reason: 'ValidationError', message: 'Missing field', location: missingField});
    }

    const validation = Joi.validate(newCourse, CourseJoiSchema);
    if (validation.error){
        return res.status(400).json({error: validation.error});
    }

    Student.findById(req.body.student_id)
        Course.create(newCourse)
            .then(student => {
                if (student) {
                    Course.create ({
                        student: req.student.id,
                        course_name: req.body.course_name
                    })
                    .then(course => res.status(201).json({
                        id: course.id,
                        student: `${student.firstname} ${student.lastname}`
                    }))
                    .catch(err => {
                        console.error(err);
                        res.status(500).json({error: 'Something went wrong'});l
                    });
                }
                else {
                    const message = `Student not found`;
                    console.error(message);
                    return res.status(400).send(message);
                }
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: 'Something went wrong!'});
            });
});


// get all coursees
courseRouter.get('/:student_Id', (req, res) => {
    Course.find()
        .sort({ course_name: -1} )
        .then( courses => {
            res.status(200).json(courses.map(course => course.serialize()))
        })
        .catch(err => {
            res.status(500).json({ error: 'something went wrong!' })
        });
});

// retrieve one course by course_name
courseRouter.get('/:course_name', (req, res) => {
    console.log('did i make it here?');
    Course.find({course_name: req.params.course_name})
        .then(courses => {
            console.log(courses);
                return res.status(200).json(courses.map(course => course.serialize()));
        })
        .catch(()=> {
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

//  remove course by course_name
courseRouter.delete('/:course_name', (req, res) => {
    return Course.deleteMany({"course_name": req.params.course_name})
        .then(() => {
            res.status(200).json({success: 'course has been removed'})
        })
        .catch(err => {
            res.status(500).json({ error: 'something went wrong!' })
        });
});

module.exports = {courseRouter};