'use strict'

// import dependencies
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

const {PORT, MONGO_DATABASE_URL} = require('./config');

app.use(bodyParser.json());

// import modules
const {deliverabletypeRouter} = require('./routes/classdeliverableoption.router');
const {classdeliverableoptionRouter} = require('./routes/classdeliverableoption.router');
const {schooltermRouter} = require('./routes/schoolterm.router');
const {strategyRouter} = require('./routes/strategy.router');
const {termclassRouter} = require('./routes/termclass.router');
const {userRouter} = require('./routes/user.router');
const { weekRouter } = require('./routes/week.router');



// routers
app.use('/api/deliverabletype', deliverabletypeRouter);
app.use('/api/classdeliverableoption', classdeliverableoptionRouter); 
app.use('/api/schoolterm', schooltermRouter);
app.use('/api/strategy', strategyRouter); 
app.use('/api/termclass', termclassRouter); 
app.use('/api/user', userRouter); 
app.use('/api/week', weekRouter);




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