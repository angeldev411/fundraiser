'use strict';
import express from 'express';
const router = express.Router();
import * as AUTH_CHECKER from '../auth/auth-checker';
import Csv from './model';
import Volunteer from '../user/volunteer/model';

router.get('/api/v1/csv/team/volunteers', (req, res) => {
    if (!AUTH_CHECKER.isLogged(req.session)) {
        res.status(404).send();
        return;
    }

    Volunteer.getVolunteers(req.session.user.project.slug, req.session.user.team.slug)
    .then((data) => {
        console.log('data', data);
        return Csv.generate(data);
    })
    .then((response) => {
        res.set('Content-Length', response.size);
        res.set('Content-Type', 'text/csv');
        res.set('Content-Disposition', 'attachment; filename=data.csv');
        res.status(200).send(response);
    })
    .catch((err) => {
        res.status(400).send(err);
    });

});

export default router;
