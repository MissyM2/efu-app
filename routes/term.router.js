'use strict';

const express = require('express');
const passport = require('passport');


const {Term} = require('../models/term.model');

const termRouter = express.Router();
termRouter.use('/', passport.authenticate('jwt', { session: false }));

// add a new term
termRouter.post('/', (req, res) => {

    const reqFields = ['termDesc'];
    const missingField = reqFields.find(field => !(field in req.body));
    if (missingField) {
        return res.status(422).json({
            code: 422, 
            reason: 'ValidationError', 
            message: 'Missing field', 
            location: missingField
        });
    }

    const newTerm = {
        termDesc: req.body.termDesc
    };

   Term.create(newTerm)
        .then(term => res.status(201).json({termDesc: term.termDesc}))
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: `${err}`});
        })
});


// get all terms
termRouter.get('/', (req, res) => {
    Term.find()
        .then(terms => {
            res.status(200).json(terms.map(term => term.serialize()));
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: `${err}` });
        });
});


// get term by id
termRouter.get('/:id', (req, res) => {
    User.findById(req.user.id)
        .then(user => {
            if (user) {
                Term.find({user: user._id, id: req.params.id})
                    .then( terms => {
                        console.log(terms);
                        return res.status(200).json(terms.map(term => term.serialize()));
                    })
                    .catch(err => {
                        console.error(err);
                        return res.status(500).json({ error: `${err}` });
                    });
            } else {
                const message = `user not found`;
                console.error(message);
                return res.status(400).send(message);
            }
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: `${err}`});
        });         
});

//update given term
termRouter.put('/', (req, res) => {
    const reqFields = [	'oldTermDesc', 'newTermDesc'];
    const missingField = reqFields.find(field => !(field in req.body));
    if (missingField) {
        return res.status(422).json({code: 422, 
            reason: 'ValidationError', 
            message: 'Missing field', 
            location: missingField
        });
    }

    const updatedTerm = {
        termDesc: req.body.newTermDesc
    }
    console.log('updatedTerm before searching', updatedTerm);
    Term.findOne({termDesc: req.body.oldTermDesc})
        .then(term => {
            if (term) {
                console.log('this is the term to be updated', term);
                Term.findOneAndUpdate({_id: term._id}, updatedTerm, {new: true})
                    .then(termupdate => {
                        res.status(200).json(termupdate);
                    })
                    .catch(err => {
                        console.error(err);
                        return res.status(500).json({error: `${err}`});
                    });
            } else {
                const message = 'term not found';
                console.error(message);
                return res.status(400).send(message);
            }
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: `${err}`});
        }); 
                    
});
 

module.exports = {termRouter};