"use strict";
const express = require('express');
// const session = require('express-session');
const session = require('client-sessions');
const bodyParser = require('body-parser');
// const multer = require('multer');

const config = require('./config');

// Routes
const authRoutes = require('./routes/auth');

const app = express();

app.use(express.static('public'));
// app.use(multer({ dest: './uploads/'}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(routes); // TODO: Pretty sure it doesn't work like that

// app.use(session({
//  secret: 'fuze23232323t',
//  cookie: { maxAge: 60000000 },
//  saveUninitialized: true,
//  resave: false
// }));

app.use(session(config.SESSION_CONFIG));

app.listen(config.EXPRESS_PORT);

module.exports = app;
