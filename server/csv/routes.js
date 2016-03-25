'use strict';
import express from 'express';
const router = express.Router();
import * as AUTH_CHECKER from '../auth/auth-checker';
import csvController from './controller';

router.get('/api/v1/csv/team/volunteers', (req, res) => {
    if (!AUTH_CHECKER.isLogged(req.session)) {
        res.status(404).send();
        return;
    }

    csvController.getTeamVolunteers(req.session.user)
    .then((response) => {
        res.set('Content-Length', response.size);
        res.set('Content-Type', 'text/csv');
        res.set('Content-Disposition', 'attachment; filename=team-volunteers.csv');
        res.status(200).send(response);
    })
    .catch((err) => {
        res.status(400).send(err);
    });
});

router.get('/api/v1/csv/team/sponsors', (req, res) => {
    if (!AUTH_CHECKER.isLogged(req.session)) {
        res.status(404).send();
        return;
    }

    csvController.getTeamSponsors(req.session.user)
    .then((response) => {
        res.set('Content-Length', response.size);
        res.set('Content-Type', 'text/csv');
        res.set('Content-Disposition', 'attachment; filename=team-sponsors.csv');
        res.status(200).send(response);
    })
    .catch((err) => {
        res.status(400).send(err);
    });
});

export default router;
