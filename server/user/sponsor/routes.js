'use strict';
import express from 'express';
const router = express.Router();
import * as AUTH_CHECKER from '../../auth/auth-checker';
import sponsorController from './controller';
import userController from '../controller';
import messages from '../../messages';

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

router.get('/api/v1/sponsor/cancel/:token', (req, res) => {
    if (!req.params.token) {
        res.status(404).send();
        return;
    }

    sponsorController.getPledge(req.params.token)
    .then((pledge) => {
        pledge.sponsor = userController.safe(pledge.sponsor);
        res.status(200).send(pledge);
    })
    .catch((err) => {
        res.status(404).send('The pledge could not be found');
    });
});

router.put('/api/v1/sponsor/cancel/:cancelToken', (req, res) => {
    if (!req.body.cancelToken) {
        res.status(404).send();
        return;
    }

    sponsorController.cancelPledge(req.body.cancelToken)
    .then((pledge) => {
        res.status(200).send(pledge);
    })
    .catch((err) => {
        res.status(500).send('An error occured.');
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
        // console.log('sponsor/team route', req);
        return res.status(400).send(messages.sponsor.missingData);
        // return;
    }

    sponsorController.sponsorTeam(req.body, req.params.teamSlug)
    .then((sponsor) => {
        res.status(200).send(sponsor);
    })
    .catch((err) => {
        console.log(err);
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
