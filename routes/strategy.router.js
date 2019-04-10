'use strict';

const express = require('express');
const Joi = require('joi');

//const { jwtPassportMiddleware } = require('../auth/auth.strategy');
const {Strategy, StrategyJoiSchema} = require('../models/strategy.model');

const strategyRouter = express.Router();

// add a new strategy
strategyRouter.post('/', (req, res) => {

    // check that all req fields are in body
    const reqFields = ['strategy_type', 'strategy_desc'];
    for (let i=0; i <reqFields.length; i++) {
        const field = reqFields[i];
            if(!(field in req.body)) {
                const message = `Missing \`${field}\` in request body`;
                console.error(message);
                return res.status(400).send(message);
            }
    }

    // create object with request items
    const newStrategy = {
        strategy_type: req.body.strategy_type,
        strategy_desc: req.body.strategy_desc,
        strategy_credit: req.body.strategy_credit
    };

    // validation
    const validation = Joi.validate(newStrategy, StrategyJoiSchema);
    if (validation.error){
        return Response.status(400).json({error: validation.error});
    }

    // create new strategy
    Strategy.create(newStrategy)
        .then(strategy => {
            return res.status(201).json(strategy.serialize());
        })
        .catch(err => {
            console.error(err);
            res.status(500).json(err);
        })
    });


// get all strategies
strategyRouter.get('/', (req, res) => {
    Strategy.find()
        .sort({ strategy_type: -1} )
        .then( strategies => {
                return res.status(200)
                    .json(strategies.map(strategy => strategy.serialize())
                    );
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json(err);
        });
});

// retrieve one strategy by strategy_id
strategyRouter.get('/:id', (req, res) => {
    Strategy.findById(req.params.id)
        .then(strategy => {
            return res.json(strategy.serialize());
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

// update strategy by strategy_id
strategyRouter.put('/:id', (req, res) => {

    // check for existence of params.id and body.id and if they match
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        return res.status(400).json({ error: 'Request path id and request body id values must match' });
    }

    // create object with updated fields
    const strategyUpdate = {
        strategy_type: req.body.strategy_type,
        strategy_desc: req.body.strategy_desc,
        strategy_credit: req.body.strategy_credit
    };

    // validate fields with Joi
    const validation = Joi.validate(strategyUpdate, StrategyJoiSchema);
    if (validation.error) {
        return response.status(400).json({error: validation.error});
    }

     //  find fields to be updated
    const updated = {};
    const updateableFields = ['strategy_type', 'strategy_desc', 'strategy_credit'];
    updateableFields.forEach(field => {
        if(field in req.body) {
            updated[field] = req.body[field];
        }
    });

    Strategy.findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
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