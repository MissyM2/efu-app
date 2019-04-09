'use strict';

const express = require('express');

//const { jwtPassportMiddleware } = require('../auth/auth.strategy');
const {Week} = require('../models/week.model');

const weekRouter = express.Router();

// add a new week
weekRouter.post('/', (req, res) => {
    const newWeek = {
        week_num: req.body.week_num,
        week_enddate: req.body.week_enddate
    };

    console.log(newWeek);

    Week
        .create(newWeek)
        .then(week => {
            return res.status(201).json(week.serialize());
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong!'})
        })
    });


// get all weeks
weekRouter.get('/', (req, res) => {
    console.log('at the get');
    Week.find()
        .sort({ week_num: -1} )
        .then( weeks => {
            return res.json(weeks);
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

// retrieve one week by id
weekRouter.get('/:id', (req, res) => {
    Week.findById(req.params.id)
        .then(week => {
            return res.json(week.serialize());
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

// update week by id
weekRouter.put('/:id', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        return res.status(400).json({ error: 'Request path id and request body id values must match' });
    }

    const updated = {};
    const updateableFields = ['week_num','week_enddate'];

    updateableFields.forEach(field => {
        if(field in req.body) {
            updated[field] = req.body[field];
        }
    });

    Week.findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
        .then((updatedWeek) => {
            return res.status(204).end();
        })
        .catch(err =>  {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

//  remove week by id
weekRouter.delete('/:week_num', (req, res) => {
    return week.findByIdAndRemove(req.params.week_num)
        .then(() => {
            console.log('deleting entry...');
            return res.status(204).end();
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

module.exports = {weekRouter};