'use strict';

const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');

const {Course} = require('../models/course.model');
const {Deliverable, DeliverableJoiSchema} = require('../models/deliverable.model');
const Joi = require('joi');

const deliverableRouter = express.Router();
deliverableRouter.use('/', passport.authenticate('jwt', {session: false}));


// add a new deliverable for a given course
deliverableRouter.post('/:courseid', (req, res) => {
    const newDeliverable = {
            course: req.params.courseid,
            deliverableName: req.body.deliverableName,
            //pressure: req.body.pressure,
            //desc: req.body.desc,
            //prephrs: req.body.prephrs
    };
    console.log('this is the new delicerable', newDeliverable);
    const reqFields = ['courseid', 'deliverableName'];
    const missingField = req.Fields.find(field => !(field in req.body));
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

   Course.findById(req.body.courseid)
    .then(course => {
        if (course) {
            Deliverable.create(newDeliverable)
                .then(deliverable => 
                    res.status(201).json(deliverable.serialize()))
                .catch(err => {
                    console.error(err);
                    return res.status(500).json({error: `${err}`});
                });
        } else {
            const message = `course not found`;
            console.error(message);
            return res.status(400).send(message);
        }
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: `${err}`});
    }); 
});
/*
// get all deliverables for selected user
deliverableRouter.get('/:course_name/deliverables', (req, res) => {
    Course.find({ course_name: req.params.course_name})
        .then(deliverables => {
            res.status(200).json(deliverables.map(deliverable => deliverable.serialize()))
        });
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