'use strict';
import express from 'express';
const router = express.Router();
import hoursController from '../../hours/controller';
import volunteerController from './controller';
import * as AUTH_CHECKER from '../../auth/auth-checker';

router.post('/api/v1/volunteer/record_hours', (req, res) => {
    const hour = {
        hours: req.body.hours,
        signatureData: req.body.signature,
        place: req.body.place,
        date: req.body.date,
        supervisorName: req.body.supervisor,
    };

    // console.log(hoursController.log(req.session.user.id, hour));
    hoursController.log(req.session.user.id, hour).then((result) => {
        res.status(200).send(result);
        return;
    }).catch((err) => {
        res.status(400).send(err);
        return;
    });
});

router.get('/api/v1/volunteer', (req, res) => {
    if (
        !AUTH_CHECKER.isLogged(req.session)
        || !AUTH_CHECKER.isSuperAdmin(req.session.user)
    ) {
        res.status(404).send();
        return;
    }

    if (!req.session.user) {
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

module.exports = router;
