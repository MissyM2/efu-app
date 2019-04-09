'use strict';

const express = require('express');

//const { jwtPassportMiddleware } = require('../auth/auth.classdeliverable_option');
const {Deliverabletype} = require('./models/classdeliverable_option.model');
const {Classdeliverableoption} = require('./models/classdeliverable_option.model');

const deliverabletypeRouter = express.Router();
const classdeliverable_optionRouter = express.Router();


//////////
// for deliverable options
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
            deliverabletype_pressure: req.body.deliverabletype_pressue,
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
deliverabletypeRouter.put('/:deliverabletype_type', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        return res.status(400).json({ error: 'Request path id and request body id values must match' });
    }

    const updated = {};
    const updateableFields = ['deliverabletype_type', 'deliverabletype_name', 'deliverabletype_desc', 'deliverabletype_prephrs'];

    updateableFields.forEach(field => {
        if(field in req.body) {
            updated[field] = req.body[field];
        }
    });

    Deliverabletype.findByIdAndUpdate(req.params.deliverabletype_id, {$set: updated}, {new: true})
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

// add a new classdeliverable_option
classdeliverable_optionRouter.post('/', (req, res) => {
    const reqFields = ['classdeliverable_option_i', 'classdeliverable_option_name', 'classdeliverable_option_name', 'classdeliverable_option_prephrs'];
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
            classdeliverable_option_type: req.body.classdeliverable_option_type,
            classdeliverable_option_name: req.body.classdeliverable_option_name,
            classdeliverable_option_desc: req.body.classdeliverable_option_desc,
            classdeliverable_option_desc: req.body.classdeliverable_option_prephrs
        })
        .then(classdeliverable_option => {
            return res.status(201).json(classdeliverable_option.serialize());
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong!'})
        })
    });


// get all classdeliverable_options
classdeliverable_optionRouter.get('/', (req, res) => {
    Classdeliverableoption.find()
        .sort({ classdeliverable_option_type: -1} )
        .then( classdeliverable_option => {
            return res.json(classdeliverable_option);
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

// retrieve one classdeliverable_option by classdeliverable_option_type
classdeliverable_optionRouter.get('/:classdeliverable_option_type', (req, res) => {
    Classdeliverableoption.findById(req.params.classdeliverable_option_type)
        .then(classdeliverable_option => {
            return res.json(classdeliverable_option.serialize());
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

// update classdeliverable_option by classdeliverable_option_type
classdeliverable_optionRouter.put('/:classdeliverable_option_type', (req, res) => {
    if (!(req.params.classdeliverable_option_type && req.body.classdeliverable_option_type && req.params.classdeliverable_option_type === req.body.classdeliverable_option_type)) {
        return res.status(400).json({ error: 'Request path id and request body id values must match' });
    }

    const updated = {};
    const updateableFields = ['classdeliverable_option_type', 'classdeliverable_option_name', 'classdeliverable_option_desc', 'classdeliverable_option_prephrs'];

    updateableFields.forEach(field => {
        if(field in req.body) {
            updated[field] = req.body[field];
        }
    });

    Classdeliverableoption.findByIdAndUpdate(req.params.classdeliverable_option_id, {$set: updated}, {new: true})
        .then(updatedclassdeliverable_option => {
            return res.status(204).end();
        })
        .catch(err =>  {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

//  remove classdeliverable_option by id
classdeliverable_optionRouter.delete('/:classdeliverable_option_type', (req, res) => {
    return Classdeliverableoption.findByIdAndRemove(req.params.classdeliverable_option_type)
        .then(() => {
            console.log('deleting entry...');
            return res.status(204).end();
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

module.exports = {classdeliverable_optionRouter};