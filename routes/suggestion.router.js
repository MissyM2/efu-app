'use strict';

const express = require('express');
const Joi = require('joi');
const passport = require('passport');

const {suggestion, suggestionJoiSchema} = require('../models/suggestion.model');

const suggestionRouter = express.Router();
suggestionRouter.use('/', passport.authenticate('jwt', { session: false }));


// add a new suggestion
suggestionRouter.post('/', (req, res) => {

    // check that all req fields are in body
    const reqFields = ['type', 'desc'];
    for (let i=0; i <reqFields.length; i++) {
        const field = reqFields[i];
            if(!(field in req.body)) {
                const message = `Missing \`${field}\` in request body`;
                console.error(message);
                return res.status(400).send(message);
            }
    }

    // create object with request items
    const newsuggestion = {
        type: req.body.type,
        desc: req.body.desc,
        credit: req.body.credit
    };

    // validation
    const validation = Joi.validate(newsuggestion, suggestionJoiSchema);
    if (validation.error){
        return Response.status(400).json({error: validation.error});
    }

    // create new suggestion
    suggestion.create(newsuggestion)
        .then(suggestion => {
            return res.status(201).json(suggestion.serialize());
        })
        .catch(err => {
            console.error(err);
            res.status(500).json(err);
        })
    });


// get all strategies
suggestionRouter.get('/', (req, res) => {
    suggestion.find()
        .sort({ type: -1} )
        .then( strategies => {
                return res.status(200)
                    .json(strategies.map(suggestion => suggestion.serialize())
                    );
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json(err);
        });
});

// retrieve one suggestion by id
suggestionRouter.get('/:id', (req, res) => {
    suggestion.findById(req.params.id)
        .then(suggestion => {
            return res.json(suggestion.serialize());
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

// update suggestion by id
suggestionRouter.put('/:id', (req, res) => {

    // check for existence of params.id and body.id and if they match
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        return res.status(400).json({ error: 'Request path id and request body id values must match' });
    }

    // create object with updated fields
    const suggestionUpdate = {
        type: req.body.type,
        desc: req.body.desc,
        credit: req.body.credit
    };

    // validate fields with Joi
    const validation = Joi.validate(suggestionUpdate, suggestionJoiSchema);
    if (validation.error) {
        return response.status(400).json({error: validation.error});
    }

     //  find fields to be updated
    const updated = {};
    const updateableFields = ['type', 'desc', 'credit'];
    updateableFields.forEach(field => {
        if(field in req.body) {
            updated[field] = req.body[field];
        }
    });

    suggestion.findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
        .then(updatedsuggestion => {
            return res.status(204).end();
        })
        .catch(err =>  {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

//  remove suggestion by id
suggestionRouter.delete('/:id', (req, res) => {
    return suggestion.findByIdAndRemove(req.params.id)
        .then(() => {
            console.log('deleting entry...');
            return res.status(204).end();
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

module.exports = {suggestionRouter};