'use strict';
import express from 'express';
const router = express.Router();
import volunteerController from './controller';
import * as AUTH_CHECKER from '../../auth/auth-checker';
import hoursController from '../../hours/controller';
import UserController from '../controller';
import messages from '../../messages';
import Sponsor from './model';

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

module.exports = router;
