'use strict';
import * as ROLES from '../user/roles';
import express from 'express';
const router = express.Router();

router.use('api/v1/:role(super-admin|volunteer|project-leader|team-leader)/*', (req, res, next) => {
    if (req.session.user && req.session.user.roles.length > 1) {
        next();
    }
    res.status(404).send();
});

router.use('api/v1/volunteer/*', (req, res, next) => {
    if (req.session.user.roles.indexOf(ROLES.VOLUNTEER) >= 0) {
        next();
    }
    res.status(403).send();
});

router.use('api/v1/team-leader/*', (req, res, next) => {
    if (req.session.user.roles.indexOf(ROLES.TEAM_LEADER) >= 0) {
        next();
    }
    res.status(403).send();
});

router.use('api/v1/project-leader/*', (req, res, next) => {
    if (req.session.user.roles.indexOf(ROLES.PROJECT_LEADER) >= 0) {
        next();
    }
    res.status(403).send();
});

router.use('api/v1/super-admin/*', (req, res, next) => {
    if (req.session.user.roles.indexOf(ROLES.SUPER_ADMIN) >= 0) {
        next();
    }
    res.status(403).send();
});

export default router;
