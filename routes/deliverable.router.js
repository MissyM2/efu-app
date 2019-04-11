'use strict';

const express = require('express');
const Joi = require('joi');
const passport = require('passport');


const {jwtAuth} = require('../auth/auth.strategies');
const {Deliverable, DeliverableJoiSchema} = require('../models/deliverable.model');

const deliverableRouter = express.Router();
deliverableRouter.use('/', passport.authenticate('jwt', {session: false}));


// add a new deliverable
deliverableRouter.post('/', (req, res) => {

    // check that all req fields are in body
    const reqFields = ['deliverable_pressure', 'deliverable_name', 'deliverable_prephrs'];
    const missingField = reqFields.find(field => !(field in req.body));
    if (missingField) {
        return res.status(422).json({code: 422, reason: 'ValidationError', message: 'Missing field', location: missingField});
    }

    // create object with request items
    const newDeliverable = {
            deliverable_pressure: req.body.deliverable_pressure,
            deliverable_name: req.body.deliverable_name,
            deliverable_desc: req.body.deliverable_desc,
            deliverable_prephrs: req.body.deliverable_prephrs
    };

    // validation
    const validation = Joi.validate(newDeliverable, DeliverableJoiSchema);
    if (validation.error){
        return Response.status(400).json({error: validation.error});
    }

    // create the new deliverable
    Deliverable.create(newDeliverable)
        .then(deliverable => {
            return res.status(201).json(deliverable.serialize());
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: 'Something went wrong!'})
        });
});


// get all deliverables
deliverableRouter.get('/', (req, res) => {
    Deliverable.find()
        .sort({ deliverable_type: -1} )
        .then( deliverables => {
            return res.status(200)
                .json(deliverables.map(deliverable => deliverable.serialize())
                );
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

// retrieve one deliverable by deliverable_type
deliverableRouter.get('/:deliverable_pressure', (req, res) => {
    console.log(req.params.deliverable_pressure);
    Deliverable.find({"deliverable_pressure": req.params.deliverable_pressure})
        .then(deliverables => {
            return res.json(deliverables.map(deliverable => deliverable.serialize()));
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

// update deliverable by id
deliverableRouter.put('/:id', (req, res) => {

    // check for existence of params.id and body.id and if they match
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        return res.status(400).json({ error: 'Request path id and request body id values must match' });
    }

    // create object with updated fields
    const deliverableUpdate = {
        deliverable_pressure: req.body.deliverable_pressure,
        deliverable_name: req.body.deliverable_name,
        deliverable_desc: req.body.deliverable_desc,
        deliverable_prephrs: req.body.deliverable_prephrs
    };

    // validate fields with Joi
    const validation = Joi.validate(deliverableUpdate, DeliverableJoiSchema);
    if (validation.error) {
        return response.status(400).json({error: validation.error});
    }

    //  find fields to be updated
    const updated = {};
    const updateableFields = ['deliverable_pressure', 'deliverable_name', 'deliverable_desc', 'deliverable_prephrs'];
    updateableFields.forEach(field => {
        if(field in req.body) {
            updated[field] = req.body[field];
        }
    });

    // find the deliverable and update it
    Deliverable.findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
        .then(updateddeliverable => {
            return res.status(204).end();
        })
        .catch(err =>  {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

//  remove deliverable by id
deliverableRouter.delete('/:id', (req, res) => {
    return Deliverable.findByIdAndRemove(req.params.id)
        .then(() => {
            console.log('deleting entry...');
            return res.status(204).end();
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});



module.exports = {deliverableRouter};