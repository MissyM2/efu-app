'use strict';

const express = require('express');
const Joi = require('joi');
const passport = require('passport');

const {Week, WeekJoiSchema} = require('../models/week.model');

const weekRouter = express.Router();
weekRouter.use('/', passport.authenticate('jwt', { session: false }));

// add a new week
weekRouter.post('/', (req, res) => {

    // check that all req fields are in body
    const reqFields = ['num', 'enddate'];
    const missingField = reqFields.find(field => !(field in req.body));
    if (missingField) {
        return res.status(422).json({code: 422, reason: 'ValidationError', message: 'Missing field', location: missingField});
    }

    // create object with request items
    const newWeek = {
        num: req.body.num,
        enddate: req.body.enddate
    };

    // validation
    const validation = Joi.validate(newWeek, WeekJoiSchema);
    if (validation.error){
        return Response.status(400).json({error: validation.error});
    }

    // create the new week
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
        .sort({ num: -1} )
        .then( weeks => {
            return res.json(weeks);
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

// retrieve one week by id
weekRouter.get('/:num', (req, res) => {
    console.log(req.params.num);
    Week.find({"num": req.params.num})
        .then(weeks => {
            return res.json(weeks.map(week=>week.serialize()));
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

// update week by id
weekRouter.put('/:num', (req, res) => {

     // check for existence of params.id and body.id and if they match
    if (!(req.params.num && req.body.num && req.params.num === req.body.num)) {
        return res.status(400).json({ error: 'Request path num and request body num values must match' });
    }

    // create object with updated fields
    const WeekUpdate = {
        enddate: req.body.enddate
    };

    // validate fields with Joi
    const validation = Joi.validate(weekUpdate, WeekJoiSchema);
    if (validation.error) {
        return response.status(400).json({error: validation.error});
    }

    //  find fields to be updated
    const updated = {};
    const updateableFields = ['num','enddate'];
    updateableFields.forEach(field => {
        if(field in req.body) {
            updated[field] = req.body[field];
        }
    });

    Week.findOneAndUpdate({"num":req.params.id}, {$set: updated}, {new: true})
        .then((updatedWeek) => {
            return res.status(200).json(updatedWeek.serialize());
        })
        .catch(err =>  {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

//  remove week by num
weekRouter.delete('/:num', (req, res) => {
    return Week.deleteOne({"num": req.params.num})
        .then(() => {
            console.log('deleting entry...');
            return res.status(200).json({success: 'week has been removed'});
        })
        .catch(error => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

module.exports = {weekRouter};