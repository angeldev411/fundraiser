'use strict';
import express from 'express';
const router = express.Router();
import * as AUTH_CHECKER from '../../auth/auth-checker';
import sponsorController from './controller';
import messages from '../../messages';
import Sponsor from './model';

router.get('/api/v1/sponsor', (req, res) => {
    if (
        !AUTH_CHECKER.isLogged(req.session)
        || !AUTH_CHECKER.isSuperAdmin(req.session.user)
    ) {
        res.status(404).send();
        return;
    }

    sponsorController.index()
    .then((data) => {
        res.status(200).send(data);
    })
    .catch((err) => {
        res.status(400).send(err);
    });
});

router.get('/api/v1/sponsor/:projectSlug', (req, res) => {
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

    sponsorController.index(req.params.projectSlug)
    .then((data) => {
        res.status(200).send(data);
    })
    .catch((err) => {
        res.status(400).send(err);
    });
});

router.get('/api/v1/sponsor/:projectSlug/:teamSlug', (req, res) => {
    if (
        !AUTH_CHECKER.isLogged(req.session)
        || (
            !AUTH_CHECKER.isTeamLeader(req.session.user)
            && !AUTH_CHECKER.isSuperAdmin(req.session.user)
        )
    ) {
        res.status(404).send();
        return;
    }

    sponsorController.index(req.params.projectSlug,req.params.teamSlug)
    .then((data) => {
        res.status(200).send(data);
    })
    .catch((err) => {
        res.status(400).send(err);
    });
});

router.post('/api/v1/sponsor/team/:teamSlug', (req, res) => {
    if (!req.body.email
        || !req.body.firstName
        || !req.body.lastName
        || !req.body.hourly
        || !req.body.cap
        || !req.params.teamSlug
    ) {
        res.status(400).send(messages.sponsor.missingData);
        return;
    }

    const data = {
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    };

    const pledge = {
        hourly: req.body.hourly,
        cap: req.body.cap,
    };

    new Sponsor(data, pledge, req.params.teamSlug)
    .then((sponsor) => {
        res.status(200).send(sponsor);
    })
    .catch((err) => {
        res.status(500).send(err);
    });
});

router.post('/api/v1/sponsor/volunteer/:volunteerSlug', (req, res) => {
    if (!req.body.email
        || !req.body.firstName
        || !req.body.lastName
        || !req.body.hourly
        || !req.body.cap
        || !req.params.volunteerSlug
    ) {
        res.status(400).send(messages.sponsor.missingData);
        return;
    }

    const data = {
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    };

    const pledge = {
        hourly: req.body.hourly,
        cap: req.body.cap,
    };

    new Sponsor(data, pledge, null, req.params.volunteerSlug)
    .then((sponsor) => {
        res.status(200).send(sponsor);
    })
    .catch((err) => {
        res.status(500).send(err);
    });
});

module.exports = router;
