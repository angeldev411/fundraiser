"use strict";
import express from 'express';
// import session from 'express-session';
import session from 'client-sessions';
import bodyParser from 'body-parser';
// import multer from 'multer';

import config from './config';
import routes from './routes';

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

export default app;
