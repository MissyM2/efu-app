'use strict';

const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');

const {User} = require('../models/user.model');
const {Course} = require('../models/course.model');
const {Deliverable, DeliverableJoiSchema} = require('../models/deliverable.model');
const Joi = require('joi');

const deliverableRouter = express.Router();
deliverableRouter.use('/', passport.authenticate('jwt', {session: false}));


// add a new deliverable for a given course
deliverableRouter.post('/', (req, res) => {
    // because the user is already authenticated,
    // can use req.user.id because user.id is already on 
    // the req so you don't have to send on the body or params
    const newDeliverable = {
            course: req.body.courseid,
            deliverableName: req.body.deliverableName,
            //pressure: req.body.pressure,
            //desc: req.body.desc,
            //prephrs: req.body.prephrs
    };
    console.log('this is the new deliverable', newDeliverable);
    const reqFields = ['courseid', 'deliverableName'];
    const missingField = reqFields.find(field => !(field in req.body));
    if (missingField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing field',
            location: missingField
        });
    }
    const validation = Joi.validate(newDeliverable, DeliverableJoiSchema);
    if (validation.error){
        return res.status(400).json({error: validation.error});
    }
    User.findById(req.user.id)
        .then(user => {
            if (user) {
                newDeliverable.user = user._id;
                console.log(newDeliverable);
                Deliverable.create(newDeliverable)
                    .then(deliverable => {
                        console.log('user is ', req.user);
                        console.log('deliverable is ', deliverable);
                        return res.status(201).json({
                            id: deliverable._id,
                            user: `${user.firstname} ${user.lastname}`,
                            course: deliverable.course,
                            deliverableName: deliverable.deliverableName
                        })
                    })
                    .catch(err => {
                        console.error(err);
                        return res.status(500).json({error: `${err}`});
                    });
            } else {
                const message = `user not found`;
                console.error(message);
                return res.status(400).send(message);
            }
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: `${err}`});
        });   
});

// get all deliverables for selected user
deliverableRouter.get('/', (req, res) => {
    console.log(req.user.id);
    User.findById(req.user.id)
        .then (user => {
            console.log(user);
            Deliverable.findById({
                    user: user._id,
                    courseid: req.body.courseid
                })
                .populate('User')
                .populate('Course')
                .then(deliverables => {
                    console.log(deliverables);
                    res.status(200).json(deliverables.map(
                        deliverable => deliverable.serialize()));
                })
                .catch(err => {
                    console.log(err);
                    return res.status(500).json({ error: `${err}`});
                });
        })
});


// get all deliverables
deliverableRouter.get('/', (req, res) => {
    Deliverable.find()
        .sort({ type: -1} )
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
/*
// retrieve one deliverable by type
deliverableRouter.get('/:pressure', (req, res) => {
    console.log(req.params.pressure);
    Deliverable.find({"pressure": req.params.pressure})
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

    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        return res.status(400).json({ error: 'Request path id and request body id values must match' });
    }

    const deliverableUpdate = {
        pressure: req.body.pressure,
        name: req.body.name,
        desc: req.body.desc,
        prephrs: req.body.prephrs
    };

    const validation = Joi.validate(deliverableUpdate, DeliverableJoiSchema);
    if (validation.error) {
        return response.status(400).json({error: validation.error});
    }

    const updated = {};
    const updateableFields = ['pressure', 'name', 'desc', 'prephrs'];
    updateableFields.forEach(field => {
        if(field in req.body) {
            updated[field] = req.body[field];
        }
    });

    Deliverable.findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
        .then(updateddeliverable => {
            return res.status(200).json(updateddeliverable.serialize());
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
            res.status(200).json({success: 'deliverable has been removed'});
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

*/

module.exports = {deliverableRouter};