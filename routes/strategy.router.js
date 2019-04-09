'use strict';

const express = require('express');

//const { jwtPassportMiddleware } = require('../auth/auth.strategy');
const {Strategy} = require('../models/strategy.model');

const strategyRouter = express.Router();

// add a new strategy
strategyRouter.post('/', (req, res) => {
    const reqFields = ['strategy_type', 'strategy_desc'];
    for (let i=0; i <reqFields.length; i++) {
        const field = reqFields[i];
            if(!(field in req.body)) {
                const message = `Missing \`${field}\` in request body`;
                console.error(message);
                return res.status(400).send(message);
            }
    }
    Strategy
        .create({
            strategy_type: req.body.strategy_type,
            strategy_desc: req.body.strategy_desc,
            strategy_credit: req.body.strategy_credit
        })
        .then(strategy => {
            return res.status(201).json(strategy.serialize());
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong!'})
        })
    });


// get all strategys
strategyRouter.get('/', (req, res) => {
    Strategy.find()
        .sort({ strategy_type: -1} )
        .then( strategy => {
            return res.json(strategy);
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

// retrieve one strategy by strategy_num
strategyRouter.get('/:strategy_id', (req, res) => {
    Strategy.findById(req.params.strategy_id)
        .then(strategy => {
            return res.json(strategy.serialize());
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

// update strategy by strategy_num
strategyRouter.put('/:strategy_id', (req, res) => {
    if (!(req.params.strategy_id && req.body.strategy_id && req.params.strategy_id === req.body.strategy_id)) {
        return res.status(400).json({ error: 'Request path id and request body id values must match' });
    }

    const updated = {};
    const updateableFields = ['strategy_type', 'strategy_desc', 'strategy_credit'];

    updateableFields.forEach(field => {
        if(field in req.body) {
            updated[field] = req.body[field];
        }
    });

    Strategy.findByIdAndUpdate(req.params.strategy_id, {$set: updated}, {new: true})
        .then(updatedstrategy => {
            return res.status(204).end();
        })
        .catch(err =>  {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

//  remove strategy by id
strategyRouter.delete('/:strategy_id', (req, res) => {
    return Strategy.findByIdAndRemove(req.params.strategy_id)
        .then(() => {
            console.log('deleting entry...');
            return res.status(204).end();
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

module.exports = {strategyRouter};