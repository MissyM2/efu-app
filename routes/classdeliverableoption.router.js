'use strict';

const express = require('express');

//const { jwtPassportMiddleware } = require('../auth/auth.classdeliverableoption');
const {Deliverabletype} = require('../models/classdeliverableoption.model');
const {Classdeliverableoption} = require('../models/classdeliverableoption.model');

const deliverabletypeRouter = express.Router();
const classdeliverableoptionRouter = express.Router();


//////////
// for deliverable types
/////////

// add a new deliverabletype
deliverabletypeRouter.post('/', (req, res) => {
    const reqFields = ['deliverabletype_pressure', 'deliverabletype_def'];
    for (let i=0; i <reqFields.length; i++) {
        const field = reqFields[i];
            if(!(field in req.body)) {
                const message = `Missing \`${field}\` in request body`;
                console.error(message);
                return res.status(400).send(message);
            }
    }
    Deliverabletype
        .create({
            deliverabletype_pressure: req.body.deliverabletype_pressure,
            deliverabletype_def: req.body.deliverabletype_def,
        })
        .then(deliverabletype => {
            return res.status(201).json(deliverabletype.serialize());
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong!'})
        })
    });


// get all deliverabletypes
deliverabletypeRouter.get('/', (req, res) => {
    Deliverabletype.find()
        .sort({ deliverabletype_type: -1} )
        .then( deliverabletype => {
            return res.json(deliverabletype);
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

// retrieve one deliverabletype by deliverabletype_type
deliverabletypeRouter.get('/:id', (req, res) => {
    Deliverabletype.findById(req.params.id)
        .then(deliverabletype => {
            return res.json(deliverabletype.serialize());
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

// update deliverabletype by deliverabletype_type
deliverabletypeRouter.put('/:id', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        return res.status(400).json({ error: 'Request path id and request body id values must match' });
    }
    const updated = {};
    const updateableFields = ['deliverabletype_pressure', 'deliverabletype_def'];

    updateableFields.forEach(field => {
        if(field in req.body) {
            updated[field] = req.body[field];
        }
    });

    Deliverabletype.findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
        .then(updateddeliverabletype => {
            return res.status(204).end();
        })
        .catch(err =>  {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

//  remove deliverabletype by id
deliverabletypeRouter.delete('/:id', (req, res) => {
    return Deliverabletype.findByIdAndRemove(req.params.id)
        .then(() => {
            console.log('deleting entry...');
            return res.status(204).end();
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

////////////////
// for class deliverable options
///////////////

// add a new classdeliverableoption
classdeliverableoptionRouter.post('/', (req, res) => {
    const reqFields = ['classdeliverableoption_type', 'classdeliverableoption_name', 'classdeliverableoption_prephrs'];
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
            classdeliverableoption_type: req.body.classdeliverableoption_type,
            classdeliverableoption_name: req.body.classdeliverableoption_name,
            classdeliverableoption_desc: req.body.classdeliverableoption_desc,
            classdeliverableoption_desc: req.body.classdeliverableoption_prephrs
        })
        .then(classdeliverableoption => {
            return res.status(201).json(classdeliverableoption.serialize());
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong!'})
        })
    });


// get all classdeliverableoptions
classdeliverableoptionRouter.get('/', (req, res) => {
    Classdeliverableoption.find()
        .sort({ classdeliverableoption_type: -1} )
        .then( classdeliverableoption => {
            return res.json(classdeliverableoption);
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

// retrieve one classdeliverableoption by classdeliverableoption_type
classdeliverableoptionRouter.get('/:classdeliverableoption_type', (req, res) => {
    Classdeliverableoption.findById(req.params.classdeliverableoption_type)
        .then(classdeliverableoption => {
            return res.json(classdeliverableoption.serialize());
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

// update classdeliverableoption by classdeliverableoption_type
classdeliverableoptionRouter.put('/:id', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.ide === req.body.id)) {
        return res.status(400).json({ error: 'Request path id and request body id values must match' });
    }

    const updated = {};
    const updateableFields = ['classdeliverableoption_type', 'classdeliverableoption_name', 'classdeliverableoption_desc', 'classdeliverableoption_prephrs'];

    updateableFields.forEach(field => {
        if(field in req.body) {
            updated[field] = req.body[field];
        }
    });

    Classdeliverableoption.findByIdAndUpdate(req.params.classdeliverableoption_id, {$set: updated}, {new: true})
        .then(updatedclassdeliverableoption => {
            return res.status(204).end();
        })
        .catch(err =>  {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

//  remove classdeliverableoption by id
classdeliverableoptionRouter.delete('/:id', (req, res) => {
    return Classdeliverableoption.findByIdAndRemove(req.params.id)
        .then(() => {
            console.log('deleting entry...');
            return res.status(204).end();
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

module.exports = {deliverabletypeRouter, classdeliverableoptionRouter};