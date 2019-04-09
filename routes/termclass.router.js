'use strict';

const express = require('express');

const { jwtPassportMiddleware } = require('../auth/auth.strategy');
const {Termclass} = require('./models/term_class.model');

const term_classRouter = express.Router();

// add a new term_class
term_classRouter.post('/', jwtPassportMiddleware, (req, res) => {
    const reqFields = ['term_class']
    for (let i=0; i <reqFields.length; i++) {
        const field = reqFields[i];
            if(!(field in req.body)) {
                const message = `Missing \`${field}\` in request body`;
                console.error(message);
                return res.status(400).send(message);
            }
    }
    Termclass
        .create({
            term_class_name: req.body.term_class_name,
            term_class_num: req.body.term_class_num,
            term_class_desc: req.body.term_class_desc,
            term_class_updateDate: req.body.term_class_updateDate,
        })
        .then(term_class => {
            return res.status(201).json(term_class.serialize());
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong!'})
        })
    });


// get all term_classs
term_classRouter.get('/', jwtPassportMiddleware, (req, res) => {
    Termclass.find()
        .sort({ term_class_name: -1} )
        .then( term_class => {
            return res.json(term_class);
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

// retrieve one term_class by term_class_num
term_classRouter.get('/:term_class_id', jwtPassportMiddleware, (req, res) => {
    Termclass.findById(req.params.term_class_id)
        .then(term_class => {
            return res.json(term_class.serialize());
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

// update term_class by term_class_num
term_classRouter.put('/:term_class_id', jwtPassportMiddleware, (req, res) => {
    if (!(req.params.term_class_num && req.body.term_class_num && req.params.term_class_num === req.body.term_class_num)) {
        return res.status(400).json({ error: 'Request path id and request body id values must match' });
    }

    const updated = {};
    const updateableFields = ['term_class_name', 'term_class_num', 'term_class_desc'];

    updateableFields.forEach(field => {
        if(field in req.body) {
            updated[field] = req.body[field];
        }
    });

    Termclass.findByIdAndUpdate(req.params.term_class_id, {$set: updated}, {new: true})
        .then(updatedterm_class => {
            return res.status(204).end();
        })
        .catch(err =>  {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

//  remove term_class by id
term_classRouter.delete('/:term_class_id', jwtPassportMiddleware, (req, res) => {
    return Termclass.findByIdAndRemove(req.params.term_class_id)
        .then(() => {
            console.log('deleting entry...');
            return res.status(204).end();
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

module.exports = {term_classRouter};