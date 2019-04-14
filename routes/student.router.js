'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const {Student} = require('../models/student.model');

const studentRouter = express.Router();

const jsonParser = bodyParser.json();

// add a new student
studentRouter.post('/', jsonParser, (req, res) => {
    console.log('made it to student post');

     // check that all req fields are present 
     const reqFields = ['studentname', 'password'];
     const missingField = reqFields.find(field => !(field in req.body));
     if (missingField) {
         return res.status(422).json({
             code: 422, 
             reason: 'ValidationError', 
             message: 'Missing field',
             location: missingField
            });
     }

     const stringFields = ['studentname', 'password', 'firstname', 'lastname'];
     const nonStringField = stringFields.find(
         field => field in req.body && typeof req.body[field] != 'string'
     );
     if (nonStringField) {
         return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Incorrect field type: expected a string',
            location: nonStringField 
        }); 
     }

     const explicitlyTrimmedFields = ['studentname', 'password'];
     const nonTrimmedField = explicitlyTrimmedFields.find(
         field => req.body[field].trim() !== req.body[field]
     );
     if (nonTrimmedField) {
         return res.status(422).json({
             code: 422,
             reason: 'ValidationError',
             message: 'Cannot start or end with whitespace',
             location: nonTrimmedField
         });
     }

    const sizedFields = {
        studentname: {
            min: 1
        },
        password: {
            min: 7,
            max: 20
        }
    };
    const tooSmallField = Object.keys(sizedFields).find(
        field =>
        'min' in sizedFields[field] &&
        req.body[field].trim().length < sizedFields[field].min
    );
    const tooLargeField = Object.keys(sizedFields).find(
        field =>
        'max' in sizedFields[field] &&
        req.body[field].trim().length > sizedFields[field].max
    );
    if (tooSmallField || tooLargeField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: tooSmallField
                ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
                : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
                location: tooSmallField || tooLargeField
        });
    }

    let {studentname, password, firstname = '', lastname = ''} = req.body;
    firstname = firstname.trim();
    lastname = lastname.trim();
    console.log('this is student router.  Did I make it past the router?');
    // does the student already exist?
    return Student.find({studentname})
        .count()
        .then(count => {
            if (count > 0) {
                return Promise.reject({
                    code: 422,
                    reason: 'ValidationError',
                    message: 'studentname already taken',
                    location: 'studentname'
                });
            }
            return Student.hashPassword(password);
        })
        .then(hash => {
            return Student.create({
                studentname,
                password: hash,
                firstname,
                lastname
            });
        })
        .then(student => {
            return res.status(201).send(student);
        })
        .catch(err => {
            // forward any validation errors to client, otherwise, status: 500
            if (err.reason === 'ValidationError') {
                return res.status(err.code).json(err);
            }
            res.status(500).json({ error: 'Something went wrong!'})
        });
});

// get all students
studentRouter.get('/', (req, res) => {
    Student.find()
        .then(students => res.status(200).json(students.map(student => student.serialize())))
        .catch(err => res.status(500).json({ error: 'something went wrong!' }));
});




module.exports = {studentRouter};