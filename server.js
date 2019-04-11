'use strict'

// import dependencies
require ('dotenv').config();
const express = require('express');  // for creating server
const mongoose = require('mongoose');    // for connecting/communicating to db
const morgan = require('morgan');  // for logging
const passport = require('passport');  //for authentication
const bodyParser = require('body-parser');  // for parsing json
const {localStrategy, jwtStrategy} = require('./auth/auth.strategies'); // for authentication and refreshing tokens

const {PORT, MONGO_DATABASE_URL} = require('./config');

const app = express();

mongoose.Promise = global.Promise;  // configure mongoose to use ES6 promises

// import modules
const { deliverableRouter } = require('./routes/deliverable.router');
const { schooltermRouter } = require('./routes/schoolterm.router');
const { suggestionRouter } = require('./routes/suggestion.router');
const { termclassRouter } = require('./routes/termclass.router');
const { userRouter } = require('./routes/user.router');
const { weekRouter } = require('./routes/week.router');
const { authRouter } = require('./auth/auth.router');

app.use(express.json());

// logging
app.use(morgan('common'));

// converting to json format
app.use(bodyParser.json());

// CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if (req.method === 'OPTIONS') {
      return res.send(204);
    }
    next();
});

// authentication
passport.use(localStrategy);
passport.use(jwtStrategy);


// public routers
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

// protected routers
app.use('/api/deliverable', deliverableRouter);
app.use('/api/schoolterm', schooltermRouter);
app.use('/api/suggestion', suggestionRouter); 
app.use('/api/termclass', termclassRouter); 
app.use('/api/week', weekRouter);

// in case of an HTTP request that is not hadles by Express server
app.use('*', (req, res) => {
    return res.status(404).json({ message: 'URL not found.'});
});


// server operations
let server;

function startServer(databaseUrl, port=PORT) {
    return new Promise((resolve,reject) => {
            let mongoUrl;
            mongoose.connect(databaseUrl, { useNewUrlParser: true }, err => { 
            if(err) {
                console.error(err);
                return reject(err);
            } else {

                server = app.listen(port, () => {
                    console.log(`Express server listening on http://localhost:${port}`);
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

if (require.main === module) { startServer(MONGO_DATABASE_URL).catch(err => console.error(err)); }

module.exports = {app, startServer, stopServer};