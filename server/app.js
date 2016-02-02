"use strict";
import config from './config';
import routes from './routes';

const app = routes;

app.listen(config.EXPRESS_PORT);
