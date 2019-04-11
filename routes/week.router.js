'use strict';

const express = require('express');
const Joi = require('joi');

//const { jwtPassportMiddleware } = require('../auth/auth.strategy');
const {Week, WeekJoiSchema} = require('../models/week.model');

const weekRouter = express.Router();

// add a new week
weekRouter.post('/', (req, res) => {

    // check that all req fields are in body
    const reqFields = ['week_num', 'week_enddate'];
    const missingField = reqFields.find(field => !(field in req.body));
    if (missingField) {
        return res.status(422).json({code: 422, reason: 'ValidationError', message: 'Missing field', location: missingField});
    }

    // create object with request items
    const newWeek = {
        week_num: req.body.week_num,
        week_enddate: req.body.week_enddate
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
weekRouter.get('/:week_num', (req, res) => {
    console.log(req.params.week_num);
    Week.find({"week_num": req.params.week_num})
        .then(weeks => {
            return res.json(weeks.map(week=>week.serialize()));
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

// update week by id
weekRouter.put('/:week_num', (req, res) => {

     // check for existence of params.id and body.id and if they match
    if (!(req.params.week_num && req.body.week_num && req.params.week_num === req.body.week_num)) {
        return res.status(400).json({ error: 'Request path week_num and request body week_num values must match' });
    }

    // create object with updated fields
    const WeekUpdate = {
        week_enddate: req.body.week_enddate
    };

    // validate fields with Joi
    const validation = Joi.validate(weekUpdate, WeekJoiSchema);
    if (validation.error) {
        return response.status(400).json({error: validation.error});
    }

    //  find fields to be updated
    const updated = {};
    const updateableFields = ['week_num','week_enddate'];
    updateableFields.forEach(field => {
        if(field in req.body) {
            updated[field] = req.body[field];
        }
    });

    Week.findOneAndUpdate({"week_num":req.params.id}, {$set: updated}, {new: true})
        .then((updatedWeek) => {
            return res.status(200).json(updatedWeek.serialize());
        })
        .catch(err =>  {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong!' });
        });
});

//  remove week by week_num
weekRouter.delete('/:week_num', (req, res) => {
    return Week.deleteOne({"week_num": req.params.week_num})
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