'use strict';

const express = require('express');

//const { jwtPassportMiddleware } = require('../auth/auth.schoolterm');
const {Schoolterm} = require('../models/schoolterm.model');

const schooltermRouter = express.Router();

// add a new schoolterm
schooltermRouter.post('/', (req, res) => {
    console.log(req.body);
    const reqFields = ['schoolterm_institution', 'schoolterm_level', 'schoolterm_level'];
    for (let i=0; i <reqFields.length; i++) {
        const field = reqFields[i];
            if(!(field in req.body)) {
                const message = `Missing \`${field}\` in request body`;
                console.error(message);
                return res.status(400).send(message);
            }
    }
    Schoolterm
        .create({
            schoolterm_institution: req.body.schoolterm_institution,
            schoolterm_level: req.body.schoolterm_level,
            schoolterm_desc: req.body.schoolterm_desc
        })
        .then(schoolterm => {
            return res.status(201).json(schoolterm.serialize());
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong!'})
        })
    });


// get all schoolterms
schooltermRouter.get('/', (req, res) => {
    Schoolterm.find()
        .sort({ schoolterm_institution: -1} )
        .then( schoolterm => {
            return res.json(schoolterm);
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

// retrieve one schoolterm by schoolterm_num
schooltermRouter.get('/:schoolterm_id', (req, res) => {
    Schoolterm.findById(req.params.schoolterm_id)
        .then(schoolterm => {
            return res.json(schoolterm.serialize());
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

// update schoolterm by schoolterm_num
schooltermRouter.put('/:schoolterm_id', (req, res) => {
    if (!(req.params.schoolterm_id && req.body.schoolterm_id && req.params.schoolterm_id === req.body.schoolterm_id)) {
        return res.status(400).json({ error: 'Request path id and request body id values must match' });
    }

    const updated = {};
    const updateableFields = ['schoolterm_institution', 'schoolterm_level', 'schoolterm_desc'];

    updateableFields.forEach(field => {
        if(field in req.body) {
            updated[field] = req.body[field];
        }
    });

    Schoolterm.findByIdAndUpdate(req.params.schoolterm_id, {$set: updated}, {new: true})
        .then(updatedschoolterm => {
            return res.status(204).end();
        })
        .catch(err =>  {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

//  remove schoolterm by id
schooltermRouter.delete('/:schoolterm_id', (req, res) => {
    return Schoolterm.findByIdAndRemove(req.params.schoolterm_id)
        .then(() => {
            console.log('deleting entry...');
            return res.status(204).end();
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

module.exports = {schooltermRouter};