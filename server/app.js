'use strict';
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

app.get('/', (req, res) => {
    res.status(200).send('Welcome to Raiserve!');
});
app.use(authRoutes);

// app.use(session({
//  secret: 'fuze23232323t',
//  cookie: { maxAge: 60000000 },
//  saveUninitialized: true,
//  resave: false
// }));

app.use(session(config.SESSION_CONFIG));

app.listen(config.EXPRESS_PORT);

console.log(`It's on! Go to http://localhost:${config.EXPRESS_PORT}`)

module.exports = app;
