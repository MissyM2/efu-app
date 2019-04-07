'use strict';

const express = require('express');

const { jwtPassportMiddleware } = require('../auth/auth.strategy');
const {Week} = require('./models/week.model');

const weekRouter = express.Router();

// add a new week
weekRouter.post('/', jwtPassportMiddleware, (req, res) => {
    const reqFields = ['week']
    for (let i=0; i <reqFields.length; i++) {
        const field = reqFields[i];
            if(!(field in req.body)) {
                const message = `Missing \`${field}\` in request body`;
                console.error(message);
                return res.status(400).send(message);
            }
    }
    Week
        .create({
            week_num: req.body.week_num,
            week_enddate: req.body.week_enddate
        })
        .then(week => {
            return res.status(201).json(week.serialize());
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong!'})
        })
    });


// get all weeks
weekRouter.get('/', jwtPassportMiddleware, (req, res) => {
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

// retrieve one week by week_num
weekRouter.get('/:week_num', jwtPassportMiddleware, (req, res) => {
    week.findById(req.params.week_num)
        .then(week => {
            return res.json(week.serialize());
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

// update week by week_num
weekRouter.put('/:week_num', jwtPassportMiddleware, (req, res) => {
    if (!(req.params.week_num && req.body.week_num && req.params.week_num === req.body.week_num)) {
        return res.status(400).json({ error: 'Request path id and request body id values must match' });
    }

    const updated = {};
    const updateableFields = ['week_num', 'week_enddate'];

    updateableFields.forEach(field => {
        if(field in req.body) {
            updated[field] = req.body[field];
        }
    });

    Week.findByIdAndUpdate(req.params.week_num, {$set: updated}, {new: true})
        .then((updatedWeek) => {
            return res.status(204).end();
        })
        .catch(err =>  {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

//  remove week by id
weekRouter.delete('/:week_num', jwtPassportMiddleware, (req, res) => {
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