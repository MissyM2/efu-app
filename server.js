'use strict'

// import dependencies
require('dotenv').config();
const express = require('express'); // npm module that allows you to code:  https://expressjs.com/
const mongoose = require('mongoose'); // npm module that handles connecting to the Mongo database:  https://mongoosejs.com/docs/guide.html
const morgan = require('morgan');  // npm module that handles logging:  https://www.npmjs.com/package/morgan 
const passport = require('passport'); //npm module that handles authentication:  http://www.passportjs.org/docs/

// import modules
const { authRouter } = require('./auth/auth.router');
const { localStrategy, jwtStrategy } = require('./auth/auth.strategy');
const { userRouter } = require('./user/user.router');
const { idealitemRouter } = require('./idealitem/idealitem.router');
const { myitemRouter } = require('./myitem/myitem.router');
const { shareitemRouter } = require('./shareitem/shareitem.router');
const { donationitemRouter } = require('./donationitem/donationitem.router');


// configure mongoose to use ES6 promises
mongoose.Promise = global.Promise;

const {PORT, HTTP_STATUS_CODES, MONGO_DATABASE_URL, TEST_MONGO_DATABASE_URL} = require('./config');

const app = express();  // initialize Express server

// MIDDLEWARE
app.use(morgan('common'));  // allowe Morgan to intercept and log all HTTP requests to the console
app.use(express.json());  //required so fetch request JSON data payload can be parsed and saved into request.body
app.use(express.static('./public')); // intercepts all HTTP request that match files inside /public

passport.use(localStrategy);  // configure Passport to use our localStrategy when receiving Username + Password combinations
passport.use(jwtStrategy); // configure Passport to use our jwtStrategy when receiving JSON Web Tokens

// public routers
app.use('/api/user', userRouter);  // redirects all calls to /api/user to userRouter
app.use('/api/auth', authRouter);  // redirects all calls to /api/user to userRouter

// protected routers
app.use('/api/idealcloset', idealitemRouter);  // redirects all calls to /api/idealcloset to idealclosetRouter
app.use('/api/userclosets/mycloset', myitemRouter);  //redirects all calls to /api/userclosets to userclosetRouter
app.use('/api/userclosets/donationcloset', donationitemRouter);  //redirects all calls to /api/donationclosets to donationitemRouter
app.use('/api/groupclosets/sharecloset', shareitemRouter);  //redirects all calls to /api/sharecloset to shareitemRouter


// in case we make an HTTP request that is unhandles by our Express server, we return a 404 status code and the message "Not Found."
app.use('*', (req, res) => {
    return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ message: 'URL not found.'});
});

let server;

function startServer(testEnv) {
    // Remember, because the process of starting/stopping a server takes time, it's preferrable to make
    // this asynchronous, and return a promise that'll reject/resolve depending if the process is succesful.

    return new Promise((resolve,reject) => {
            let mongoUrl;
            if (testEnv) {
                mongoUrl = TEST_MONGO_DATABASE_URL;
            } else {
                mongoUrl = MONGO_DATABASE_URL;
            }
            // Step 1: Attempt to connect to MongoDB with mongoose
            mongoose.connect(mongoUrl, { useNewUrlParser: true }, err => { 
            if(err) {
                 // Step 2A: If there is an error starting mongo, log error, reject promise and stop code execution.
                 console.error(err);
                return reject(err);
            } else {
            
                // Step 2B: Start Express server
                server = app.listen(PORT, () => {
                    // Step 3A: Log success message to console and resolve promise.
                    console.log(`Express server listening on http://localhost:${PORT}`);
                    resolve();
                })
                .on('error', err => {
                    // Step 3B: If there was a problem starting the Express server, disconnect from MongoDB immediately, log error to console and reject promise.
                    mongoose.disconnect();
                    console.error(err);
                    reject(err);
                });
            }
        });
    });
}

function stopServer() {
    // Remember, because the process of starting/stopping a server takes time, it's preferrable to make
    // this asynchronous, and return a promise that'll reject/resolve depending if the process is succesful.

    // Step 1: Disconnect from the MongoDB database using Mongoose
    return mongoose
        .disconnect()
        .then(() =>  new Promise((resolve, reject) => {
            // Step 2:  Shut down the ExpressJS server
            server.close(err => {
                if(err) {
                    // Step 3A: If an error ocurred while shutting down, print out the error to the console and resolve promise;
                    console.error(err);
                    return reject(err);
                } else {
                    // Step 3B: If the server shutdown correctly, log a success message.
                    console.log('Express server stopped.');
                    resolve();
                }
            });
        }));
}

module.exports = {app, startServer, stopServer};