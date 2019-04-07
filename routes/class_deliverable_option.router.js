'use strict';

const express = require('express');

const { jwtPassportMiddleware } = require('../auth/auth.class_deliverable_option');
const {Classdeliverableoption} = require('./models/class_deliverable_option.model');

const class_deliverable_optionRouter = express.Router();

// add a new class_deliverable_option
class_deliverable_optionRouter.post('/', jwtPassportMiddleware, (req, res) => {
    const reqFields = ['class_deliverable_option_i', 'class_deliverable_option_name', 'class_deliverable_option_name', 'class_deliverable_option_prephrs'];
    for (let i=0; i <reqFields.length; i++) {
        const field = reqFields[i];
            if(!(field in req.body)) {
                const message = `Missing \`${field}\` in request body`;
                console.error(message);
                return res.status(400).send(message);
            }
    }
    Classdeliverableoption
        .create({
            class_deliverable_option_type: req.body.class_deliverable_option_type,
            class_deliverable_option_name: req.body.class_deliverable_option_name,
            class_deliverable_option_desc: req.body.class_deliverable_option_desc,
            class_deliverable_option_desc: req.body.class_deliverable_option_prephrs
        })
        .then(class_deliverable_option => {
            return res.status(201).json(class_deliverable_option.serialize());
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong!'})
        })
    });


// get all class_deliverable_options
class_deliverable_optionRouter.get('/', jwtPassportMiddleware, (req, res) => {
    Classdeliverableoption.find()
        .sort({ class_deliverable_option_type: -1} )
        .then( class_deliverable_option => {
            return res.json(class_deliverable_option);
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

// retrieve one class_deliverable_option by class_deliverable_option_type
class_deliverable_optionRouter.get('/:class_deliverable_option_type', jwtPassportMiddleware, (req, res) => {
    Classdeliverableoption.findById(req.params.class_deliverable_option_type)
        .then(class_deliverable_option => {
            return res.json(class_deliverable_option.serialize());
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

// update class_deliverable_option by class_deliverable_option_type
class_deliverable_optionRouter.put('/:class_deliverable_option_type', jwtPassportMiddleware, (req, res) => {
    if (!(req.params.class_deliverable_option_type && req.body.class_deliverable_option_type && req.params.class_deliverable_option_type === req.body.class_deliverable_option_type)) {
        return res.status(400).json({ error: 'Request path id and request body id values must match' });
    }

    const updated = {};
    const updateableFields = ['class_deliverable_option_type', 'class_deliverable_option_name', 'class_deliverable_option_desc', 'class_deliverable_option_prephrs'];

    updateableFields.forEach(field => {
        if(field in req.body) {
            updated[field] = req.body[field];
        }
    });

    Classdeliverableoption.findByIdAndUpdate(req.params.class_deliverable_option_id, {$set: updated}, {new: true})
        .then(updatedclass_deliverable_option => {
            return res.status(204).end();
        })
        .catch(err =>  {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

//  remove class_deliverable_option by id
class_deliverable_optionRouter.delete('/:class_deliverable_option_type', jwtPassportMiddleware, (req, res) => {
    return Classdeliverableoption.findByIdAndRemove(req.params.class_deliverable_option_type)
        .then(() => {
            console.log('deleting entry...');
            return res.status(204).end();
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

module.exports = {class_deliverable_optionRouter};