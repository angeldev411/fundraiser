'use strict';
const express = require('express');
const session = require('client-sessions');
const bodyParser = require('body-parser');
// const multer = require('multer');

const config = require('./config');

const app = express();

app.use(express.static('public'));
// app.use(multer({ dest: './uploads/'}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(session(config.SESSION_CONFIG));

// CORS
app.use((rea, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // TODO change this in production
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Routes
const authRoutes = require('./auth/routes');

app.get('/', (req, res, next) => {
    res.status(200).send('Welcome to Raiserve!');
    next();
});
app.use(authRoutes);

// const session = require('express-session');
// If using classic sessions
// app.use(session({
//  secret: 'fuze23232323t',
//  cookie: { maxAge: 60000000 },
//  saveUninitialized: true,
//  resave: false
// }));

app.listen(config.EXPRESS_PORT);

console.log(`It's on! Go to http://localhost:${config.EXPRESS_PORT}`)

module.exports = app;
