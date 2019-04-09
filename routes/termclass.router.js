'use strict';

const express = require('express');

//const { jwtPassportMiddleware } = require('../auth/auth.strategy');
const {Termclass} = require('../models/termclass.model');

const termclassRouter = express.Router();

// add a new termclass
termclassRouter.post('/', (req, res) => {
    const newTermclass = {
        termclass_name: req.body.termclass_name,
        termclass_num: req.body.termclass_num,
        termclass_desc: req.body.termclass_desc
    };

    console.log(newTermclass);
   
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
        .sort({ termclass_name: -1} )
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
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        return res.status(400).json({ error: 'Request path id and request body id values must match' });
    }

    const updated = {};
    const updateableFields = ['termclass_name', 'termclass_num', 'termclass_desc'];

    updateableFields.forEach(field => {
        if(field in req.body) {
            updated[field] = req.body[field];
        }
    });

    Termclass.findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
        .then(updatedtermclass => {
            return res.status(204).end();
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
            return res.status(204).end();
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

module.exports = {termclassRouter};