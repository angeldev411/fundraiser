'use strict';
import express from 'express';
const router = express.Router();
import volunteerController from './controller';
import * as AUTH_CHECKER from '../../auth/auth-checker';
import util from '../../helpers/util';

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

    const user = Object.assign({}, req.session.user);

    for (const prop in req.body) {
        if (req.body[prop]) {
            if (prop === 'password') {
                user[prop] = util.hash(req.body[prop]);
            } else {
                user[prop] = req.body[prop];
            }
        }
    }

    volunteerController.update(req.session.user, user)
    .then((data) => {
        res.status(200).send(data);
    })
    .catch((err) => {
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
    volunteerController.index(req.params.projectSlug, req.params.teamSlug)
    .then((data) => {
        res.status(200).send(data);
    })
    .catch((err) => {
        res.status(400).send(err);
    });
});

router.get('/api/v1/volunteer/:projectSlug/:teamSlug/top', (req, res) => {
    volunteerController.indexTopVolunteers(req.params.projectSlug, req.params.teamSlug)
    .then((data) => {
        res.status(200).send(data);
    })
    .catch((err) => {
        res.status(400).send(err);
    });
});

module.exports = router;
