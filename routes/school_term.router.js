'use strict';

const express = require('express');

const { jwtPassportMiddleware } = require('../auth/auth.school_term');
const {Schoolterm} = require('./models/school_term.model');

const school_termRouter = express.Router();

// add a new school_term
school_termRouter.post('/', jwtPassportMiddleware, (req, res) => {
    const reqFields = ['school_term_institution', 'school_term_level', 'school_term_level'];
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
            school_term_institution: req.body.school_term_institution,
            school_term_level: req.body.school_term_level,
            school_term_desc: req.body.school_term_desc
        })
        .then(school_term => {
            return res.status(201).json(school_term.serialize());
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong!'})
        })
    });


// get all school_terms
school_termRouter.get('/', jwtPassportMiddleware, (req, res) => {
    Schoolterm.find()
        .sort({ school_term_institution: -1} )
        .then( school_term => {
            return res.json(school_term);
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

// retrieve one school_term by school_term_num
school_termRouter.get('/:school_term_id', jwtPassportMiddleware, (req, res) => {
    Schoolterm.findById(req.params.school_term_id)
        .then(school_term => {
            return res.json(school_term.serialize());
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

// update school_term by school_term_num
school_termRouter.put('/:school_term_id', jwtPassportMiddleware, (req, res) => {
    if (!(req.params.school_term_id && req.body.school_term_id && req.params.school_term_id === req.body.school_term_id)) {
        return res.status(400).json({ error: 'Request path id and request body id values must match' });
    }

    const updated = {};
    const updateableFields = ['school_term_institution', 'school_term_level', 'school_term_desc'];

    updateableFields.forEach(field => {
        if(field in req.body) {
            updated[field] = req.body[field];
        }
    });

    Schoolterm.findByIdAndUpdate(req.params.school_term_id, {$set: updated}, {new: true})
        .then(updatedschool_term => {
            return res.status(204).end();
        })
        .catch(err =>  {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

//  remove school_term by id
school_termRouter.delete('/:school_term_id', jwtPassportMiddleware, (req, res) => {
    return Schoolterm.findByIdAndRemove(req.params.school_term_id)
        .then(() => {
            console.log('deleting entry...');
            return res.status(204).end();
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

module.exports = {school_termRouter};