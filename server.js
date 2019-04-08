'use strict'
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const {PORT, MONGO_DATABASE_URL} = require('./config');

app.get('/api/*', (req, res) => {
    res.json({ok: true});
});

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