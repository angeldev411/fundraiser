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
        || (
            !AUTH_CHECKER.isVolunteer(req.session.user)
            && !AUTH_CHECKER.isTeamLeader(req.session.user)
            && !AUTH_CHECKER.isProjectLeader(req.session.user)
            && !AUTH_CHECKER.isSuperAdmin(req.session.user)
        )
    ) {
        res.status(404).send();
        return;
    }

    let query;

    if (AUTH_CHECKER.isProjectLeader(req.session.user)) {
        query = () => {
            return sponsorController.index(req.session.user.project.slug);
        };
    } else if (AUTH_CHECKER.isTeamLeader(req.session.user)) {
        query = () => {
            return sponsorController.index(req.session.user.project.slug, req.session.user.team.slug);
        };
    } else if (AUTH_CHECKER.isVolunteer(req.session.user)) {
        query = () => {
            return sponsorController.index(req.session.user.project.slug, req.session.user.team.slug, req.session.user.slug);
        };
    } else {
        query = () => {
            return sponsorController.index();
        };
    }

    query()
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
        || !AUTH_CHECKER.isSuperAdmin(req.session.user)
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
        || !AUTH_CHECKER.isSuperAdmin(req.session.user)
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

router.get('/api/v1/sponsor/:projectSlug/:teamSlug/:volunteerSlug', (req, res) => {
    if (
        !AUTH_CHECKER.isLogged(req.session)
        || !AUTH_CHECKER.isSuperAdmin(req.session.user)
    ) {
        res.status(404).send();
        return;
    }

    sponsorController.index(req.params.projectSlug, req.params.teamSlug, req.params.volunteerSlug)
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
        || (req.body.hourly && req.body.amount)
        || (!req.body.hourly && !req.body.amount)
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
        ...(req.body.hourly ? { hourly: req.body.hourly } : {}),
        ...(req.body.amount ? { amount: req.body.amount } : {}),
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
        || (req.body.hourly && req.body.amount)
        || (!req.body.hourly && !req.body.amount)
        || !req.params.volunteerSlug
    ) {
        res.status(400).send(messages.sponsor.missingData);
        return;
    }

    sponsorController.sponsorVolunteer(req.body, req.params.volunteerSlug)
    .then((sponsor) => {
        res.status(200).send(sponsor);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send(err);
    });
});

module.exports = router;
