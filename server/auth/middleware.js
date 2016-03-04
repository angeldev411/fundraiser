'use strict';
import * as AUTH_CHECKER from './auth-checker';
import express from 'express';
const router = express.Router();

router.use('/api/v1/:role(super-admin|project-leader|team-leader)/*', (req, res, next) => {
    if (AUTH_CHECKER.isLogged(req.session)) {
        next();
        return;
    }
    res.status(404).send();
    return;
});

// TODO refactor public and private route
// Private : api/v1/admin/volunteer....
// Privare : api/v1/volunteer....
//
// router.use('/api/v1/volunteer/*', (req, res, next) => {
//     if (AUTH_CHECKER.isVolunteer(req.session.user) >= 0) {
//         next();
//         return;
//     }
//     res.status(403).send();
//     return;
// });

router.use('/api/v1/team-leader/*', (req, res, next) => {
    if (AUTH_CHECKER.isTeamLeader(req.session.user)) {
        next();
        return;
    }
    res.status(403).send();
    return;
});

router.use('/api/v1/project-leader/*', (req, res, next) => {
    if (AUTH_CHECKER.isProjectLeader(req.session.user)) {
        next();
        return;
    }
    res.status(403).send();
    return;
});

router.use('/api/v1/super-admin/*', (req, res, next) => {
    if (AUTH_CHECKER.isSuperAdmin(req.session.user)) {
        next();
        return;
    }
    res.status(403).send();
    return;
});

export default router;
