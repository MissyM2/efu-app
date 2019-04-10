'use strict';

const express = require('express');

//const { jwtPassportMiddleware } = require('../auth/auth.deliverable');
const {Deliverable} = require('../models/deliverable.model');

const deliverableRouter = express.Router();


// add a new deliverable
deliverableRouter.post('/', (req, res) => {
    const newDeliverable = {
            deliverable_pressure: req.body.deliverable_pressure,
            deliverable_name: req.body.deliverable_name,
            deliverable_desc: req.body.deliverable_desc,
            deliverable_prephrs: req.body.deliverable_prephrs
    };

    Deliverable.create(newDeliverable)
        .then(deliverable => {
            return res.status(201).json(deliverable.serialize());
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong!'})
        })
    });


// get all deliverables
deliverableRouter.get('/', (req, res) => {
    Deliverable.find()
        .sort({ deliverable_type: -1} )
        .then( deliverable => {
            return res.json(deliverable);
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

// retrieve one deliverable by deliverable_type
deliverableRouter.get('/:id', (req, res) => {
    Deliverable.findById(req.params.id)
        .then(deliverable => {
            return res.json(deliverable.serialize());
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

// update deliverable by deliverable_type
deliverableRouter.put('/:id', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        return res.status(400).json({ error: 'Request path id and request body id values must match' });
    }
    const updated = {};
    const updateableFields = ['deliverable_pressure', 'deliverable_name', 'deliverable_desc', 'deliverable_prephrs'];

    updateableFields.forEach(field => {
        if(field in req.body) {
            updated[field] = req.body[field];
        }
    });

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