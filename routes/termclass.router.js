'use strict';

const express = require('express');
const passport = require('passport');

const {Termclass, TermclassJoiSchema} = require('../models/termclass.model');
const Joi = require('joi');

const termclassRouter = express.Router();
termclassRouter.use("/", passport.authenticate('jwt', { session: false }));

// add a new termclass
termclassRouter.post('/', (req, res) => {

    // check that all req fields are in body
    const reqFields = ['name', 'num'];
    const missingField = reqFields.find(field => !(field in req.body));
    if (missingField) {
        return res.status(422).json({code: 422, reason: 'ValidationError', message: 'Missing field', location: missingField});
    }

    // create object with request items
    const newTermclass = {
        name: req.body.name,
        num: req.body.num,
        desc: req.body.desc
    };

    // validation
    const validation = Joi.validate(newTermclass, TermclassJoiSchema);
    if (validation.error){
        return Response.status(400).json({error: validation.error});
    }
   
    // create the new termclass
    Termclass
        .create(newTermclass)
        .then(termclass => {
            return res.status(201).json(termclass.serialize());
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong!'})
        })
    });


// get all termclasses
termclassRouter.get('/', (req, res) => {
    Termclass.find()
        .sort({ name: -1} )
        .then( termclass => {
            return res.json(termclass);
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

// retrieve one termclass by id
termclassRouter.get('/:id', (req, res) => {
    Termclass.findById(req.params.id)
        .then(termclass => {
            return res.json(termclass.serialize());
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

// update termclass by id
termclassRouter.put('/:id', (req, res) => {

    // check for existence of params.id and body.id and if they match
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        return res.status(400).json({ error: 'Request path id and request body id values must match' });
    }

    // create object with updated fields
    const termclassUpdate = {
        name: req.body.name,
        num: req.body.num,
        desc: req.body.desc
    };

    // validate fields with Joi
    const validation = Joi.validate(termclassUpdate, TermclassJoiSchema);
    if (validation.error) {
        return response.status(400).json({error: validation.error});
    }

    //  find fields to be updated
    const updated = {};
    const updateableFields = ['name', 'num', 'desc'];
    updateableFields.forEach(field => {
        if(field in req.body) {
            updated[field] = req.body[field];
        }
    });

     // find the termclass and update it
    Termclass.findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
        .then(updatedtermclass => {
            return res.status(200).json(updatedtermclass.serialize());
        })
        .catch(err =>  {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

//  remove termclass by id
termclassRouter.delete('/:id', (req, res) => {
    return Termclass.findByIdAndRemove(req.params.id)
        .then(() => {
            console.log('deleting entry...');
            return res.status(200).json({success: 'termclass has been removed'})
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

module.exports = {termclassRouter};