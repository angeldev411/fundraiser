'use strict';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import * as Urls from '../src/urls.js';
// import multer from 'multer';

import config from './config';

const app = express();
const sess = config.SESSION_CONFIG;

if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}

// app.use(multer({ dest: './uploads/'}));
app.use(cookieParser());
app.use(session(sess));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

import securityMiddleware from './auth/middleware';
app.use(securityMiddleware);

// Routes
import authRoutes from './auth/routes';
import projectRoutes from './project/routes';
import teamRoutes from './team/routes';
import userRoutes from './user/routes';
import volunteersRoutes from './user/volunteer/routes';
import superAdminRoutes from './user/super-admin/routes';
import teamLeadersRoutes from './user/team-leader/routes';
import projectLeadersRoutes from './user/project-leader/routes';
import sponsorRoutes from './user/sponsor/routes';
import hoursRoutes from './hours/routes';
import emailRoutes from './email/routes';
import csvRoutes from './csv/routes';

app.use('/health-check', (req, res) => {
    res.status(200).send(true);
});

app.use(authRoutes);
app.use(projectRoutes);
app.use(teamRoutes);
app.use(userRoutes);
app.use(volunteersRoutes);
app.use(superAdminRoutes);
app.use(teamLeadersRoutes);
app.use(projectLeadersRoutes);
app.use(hoursRoutes);
app.use(sponsorRoutes);
app.use(emailRoutes);
app.use(csvRoutes);

app.use(`${Urls.REDIRECT_TO_DASHBOARD}`, (req, res) => {
    if (req.session.user) {
        if (req.session.user.roles.indexOf('SUPER_ADMIN') >= 0) {
            res.redirect(Urls.ADMIN_PROJECTS_URL);
        } else if (req.session.user.roles.indexOf('PROJECT_LEADER') >= 0) {
            res.redirect(Urls.ADMIN_TEAMS_URL);
        } else if (req.session.user.roles.indexOf('TEAM_LEADER') >= 0) {
            res.redirect(Urls.ADMIN_TEAM_DASHBOARD_URL);
        } else if (req.session.user.roles.indexOf('VOLUNTEER') >= 0) {
            res.redirect(Urls.ADMIN_VOLUNTEER_DASHBOARD_URL);
        }
    }
});

app.use('/api/v1/*', (req, res) => {
    res.status(404).send();
    return;
});

app.use(express.static(`${__dirname}/../www/`));
app.use('*', express.static(`${__dirname}/../www/`));

app.listen(config.EXPRESS_PORT);

console.log(`Raiserve Running on http://localhost:${config.EXPRESS_PORT}`);

export default app;
