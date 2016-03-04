'use strict';
import express from 'express';
const router = express.Router();
import volunteerController from './controller';
import * as AUTH_CHECKER from '../../auth/auth-checker';

router.get('/api/v1/volunteer', (req, res) => {
    if (
        !AUTH_CHECKER.isLogged(req.session)
        || !AUTH_CHECKER.isSuperAdmin(req.session.user)
    ) {
        res.status(404).send();
        return;
    }

    volunteerController.index()
    .then((data) => {
        res.status(200).send(data);
    })
    .catch((err) => {
        res.status(400).send(err);
    });
});

router.put('/api/v1/volunteer', (req, res) => {
    if (
        !AUTH_CHECKER.isLogged(req.session)
    ) {
        res.status(403).send();
        return;
    }

    const user = req.body;

    user.id = req.session.user.id;

    volunteerController.update(user)
    .then((data) => {
        console.log('Volunteer', data);
        res.status(200).send(data);
    })
    .catch((err) => {
        console.log('Volunteer Failure', err, user);
        res.status(400).send(err);
    });
});

router.get('/api/v1/volunteer/:projectSlug', (req, res) => {
    if (
        !AUTH_CHECKER.isLogged(req.session)
        || (
            !AUTH_CHECKER.isProjectLeader(req.session.user)
            && !AUTH_CHECKER.isSuperAdmin(req.session.user)
        )
    ) {
        res.status(404).send();
        return;
    }

    volunteerController.index(req.params.projectSlug)
    .then((data) => {
        res.status(200).send(data);
    })
    .catch((err) => {
        res.status(400).send(err);
    });
});

router.get('/api/v1/volunteer/:projectSlug/:teamSlug', (req, res) => {
    // if (
    //     !AUTH_CHECKER.isLogged(req.session)
    //     || (
    //         !AUTH_CHECKER.isTeamLeader(req.session.user)
    //         && !AUTH_CHECKER.isProjectLeader(req.session.user)
    //         && !AUTH_CHECKER.isSuperAdmin(req.session.user)
    //     )
    // ) {
    //     res.status(404).send();
    //     return;
    // }

    volunteerController.index(req.params.projectSlug, req.params.teamSlug)
    .then((data) => {
        res.status(200).send(data);
    })
    .catch((err) => {
        res.status(400).send(err);
    });
});

module.exports = router;
