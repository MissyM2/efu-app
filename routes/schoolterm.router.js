'use strict';

const express = require('express');
const Joi = require('joi');

//const { jwtPassportMiddleware } = require('../auth/auth.schoolterm');
const {Schoolterm, SchooltermJoiSchema} = require('../models/schoolterm.model');

const schooltermRouter = express.Router();

// add a new schoolterm
schooltermRouter.post('/', (req, res) => {
    
    // check that all req fields are in body
    const reqFields = ['schoolterm_institution', 'schoolterm_level', 'schoolterm_desc'];
    for (let i=0; i <reqFields.length; i++) {
        const field = reqFields[i];
            if(!(field in req.body)) {
                const message = `Missing \`${field}\` in request body`;
                console.error(message);
                return res.status(400).send(message);
           };
    };

    const newSchoolterm = {
        schoolterm_institution: req.body.schoolterm_institution,
        schoolterm_level: req.body.schoolterm_level,
        schoolterm_desc: req.body.schoolterm_desc
    }

    const validation = Joi.validate(newSchoolterm, SchooltermJoiSchema);
    if(validation.error) {
        return response.status(400).json({error:validation.error});
    }

    Schoolterm
        .create(newSchoolterm)
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
        .then(schoolterms => {
            console.log(schoolterms);
            return res.status(200)
            .json(schoolterms.map(schoolterm => schoolterm.serialize())
            );
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

// retrieve one schoolterm by id
schooltermRouter.get('/:id', (req, res) => {
    Schoolterm.findById(req.params.id)
        .then(schoolterm => {
            return res.json(schoolterm.serialize());
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

// update schoolterm by id
schooltermRouter.put('/:id', (req, res) => {

    // check for existene of params.id and body.id and if they match
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        return res.status(400).json({ error: 'Request path id and request body id values must match' });
    }

    const schooltermUpdate = {
        schoolterm_institution: req.body.schoolterm_institution,
        schoolterm_level: req.body.schoolterm_level,
        schoolterm_desc: req.body.schoolterm_desc
    }

    const validation = Joi.validate(schooltermUpdate, SchooltermJoiSchema);
    if (validation.error) {
        return response.status(400).json({error: validation.error});
    }

    // determine fields to be updated
    const updated = {};
    const updateableFields = ['schoolterm_institution', 'schoolterm_level', 'schoolterm_desc'];
    updateableFields.forEach(field => {
        if(field in req.body) {
            updated[field] = req.body[field];
        }
    });

    Schoolterm.findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
        .then( updatedItem => {
            return res.status(200).json(updatedItem.serialize());
        })
        .catch(err =>  {
            return res.status(500).json(err);
        });
});

//  remove schoolterm by id
schooltermRouter.delete('/:schoolterm_id', (req, res) => {
    return Schoolterm.findByIdAndRemove(req.params.schoolterm_id)
        .then(() => {
            console.log('deleting entry...');
            return res.status(204).end();
        })
        .catch(err => {
            return res.status(500).json(err);
        });
});

module.exports = {schooltermRouter};