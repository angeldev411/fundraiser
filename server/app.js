'use strict';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
// import multer from 'multer';

import config from './config';

const app = express();

// app.use(multer({ dest: './uploads/'}));
app.use(cookieParser());
app.use(session(config.SESSION_CONFIG));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Routes
import authRoutes from './auth/routes';
import projectRoutes from './project/routes';
import teamRoutes from './team/routes';

app.use(authRoutes);
app.use(projectRoutes);
app.use(teamRoutes);

app.use(express.static(`${__dirname}/../www/`));
app.use('*', express.static(`${__dirname}/../www/`));

app.listen(config.EXPRESS_PORT);

console.log(`It's on! Go to http://localhost:${config.EXPRESS_PORT}`)

export default app;
