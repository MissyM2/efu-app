'use strict'

// import dependencies
require ('dotenv').config();
const express = require('express');  // for creating server
const cors = require('cors');
const mongoose = require('mongoose');    // for connecting/communicating to db
const morgan = require('morgan');  // for logging
const passport = require('passport');  //for authentication
const bodyParser = require('body-parser');  // for parsing json
const {localStrategy, jwtStrategy} = require('./auth/auth.strategies'); // for authentication and refreshing tokens

const {PORT, MONGO_DATABASE_URL, CLIENT_ORIGIN} = require('./config');

const app = express();


mongoose.Promise = global.Promise;  // configure mongoose to use ES6 promises

// converting to json format
app.use(bodyParser.json());

// import modules
const { userRouter } = require('./routes/user.router');
const { authRouter } = require('./auth/auth.router');
const { termRouter } = require('./routes/term.router');
const { courseRouter } = require('./routes/course.router');
const { weekRouter } = require('./routes/week.router');
const { gradeRouter } = require('./routes/grade.router');
const { deliverableRouter } = require('./routes/deliverable.router');
const { suggestionRouter } = require('./routes/suggestion.router');

app.use(express.json());
//app.use(
//    cors({
//        origin: CLIENT_ORIGIN
//    })
//);

// logging
app.use(morgan('common'));



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
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/suggestion', suggestionRouter); 

// protected routers
app.use('/api/terms', termRouter);
app.use('/api/weeks', weekRouter);
app.use('/api/courses', courseRouter);
app.use('/api/grades', gradeRouter);
app.use('/api/deliverables', deliverableRouter);
app.use('/api/suggestions', suggestionRouter);


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