'use strict'

// import dependencies
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose'); 
const morgan = require('morgan');  
const passport = require('passport'); 

// import modules
const { authRouter } = require('./auth/auth.router');
const { localStrategy, jwtStrategy } = require('.//auth.strategy');
const { weekRouter } = require('./routes/week.router');
const { userRouter } = require('./routes/user.router');
const { term_classRouter } = require('./routes/term_class.router');
const { strategyRouter } = require('./routes/strategy.router');
const { school_termRouter } = require('./school_term.router');


// configure mongoose to use ES6 promises
mongoose.Promise = global.Promise;

const {PORT} = require('./config');

const app = express();  // initialize Express server

// MIDDLEWARE
app.use(morgan('common'));
app.use(express.json()); 
app.use(express.static('./public'));

passport.use(localStrategy); 
passport.use(jwtStrategy);

// public routes
app.use('/api/user', userRouter); 
app.use('/api/auth', authRouter);

// protected routes
app.use('/api/routes', weekRouter);
app.use('/api/routes', userRouter);
app.use('/api/routes', term_classRouter); 
app.use('/api/routes', strategyRouter);
app.use('/api/routes', school_termRouter);
app.use('/api/routes', class_deliverable_optionRouter);

app.use('*', (req, res) => {
    return res.status(404).json({ message: 'URL not found.'});
});

app.get('/api/*', (req, res) => {
    res.json({ok: true});
});

let server;

function startServer(testEnv) {
    return new Promise((resolve,reject) => {
            let mongoUrl;
            if (testEnv) {
                mongoUrl = TEST_MONGO_DATABASE_URL;
            } else {
                mongoUrl = MONGO_DATABASE_URL;
            }
            mongoose.connect(mongoUrl, { useNewUrlParser: true }, err => { 
            if(err) {
                console.error(err);
                return reject(err);
            } else {

                server = app.listen(PORT, () => {
                                        console.log(`Express server listening on http://localhost:${PORT}`);
                    resolve();
                })
                .on('error', err => {
                                        mongoose.disconnect();
                    console.error(err);
                    reject(err);
                });
            }
        });
    });
}

function stopServer() {
    return mongoose
        .disconnect()
        .then(() =>  new Promise((resolve, reject) => {
            server.close(err => {
                if(err) {
                    console.error(err);
                    return reject(err);
                } else {
                    console.log('Express server stopped.');
                    resolve();
                }
            });
        }));
}

module.exports = {app, startServer, stopServer};