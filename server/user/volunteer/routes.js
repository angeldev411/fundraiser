'use strict';

import express from 'express';
import util from '../../helpers/util';
import hoursController from '../../hours/controller';
const router = express.Router();

router.get('/api/v1/volunteers/:uuid.json', (req, res) => {
    volunteer.fetchByUuid(req.params.uuid)
    .then((data) => {
        res.send(util.rsSuccess({ volunteer: data }));
    })
    .catch((err) => {
        console.log('error fetching volunteer by uuid ' + err);
        res.send('error fetching voluneer ' + err);
    });
});

/* just fetch all team members for teams I lead now */
router.get('/api/v1/leader/volunteers.json', (req, res) => {
    team.fetchVolunteersILead(req.session.user_uuid)
    .then((data) => {
        res.send(util.rsSuccess({ volunteers: data }));
    })
    .catch((err) => {
        console.log(err);
        res.send('error ' + JSON.stringify(err));
    });
});

router.get('/api/v1/volunteering_for_teams.json', (req, res) => {
    user.volunteeringForTeams(req.session.user_uuid)
    .then((result) => {
        console.log('successful volunteer teams fetch ' + req.session.user_uuid);
        res.send(util.rsSuccess(result));
    })
    .catch((err) => {
        console.error('post received: errors ' + err);
        res.send(JSON.stringify(util.rsFailure(err)));
    });
});

router.get('/api/v1/volunteer/my_stats.json', (req, res) => {
    res.send('vols path working');
});

router.post('/api/v1/volunteer/record_hours', (req, res) => {
    if (!req.session.user) {
        res.status(403).send('Not logged in');
    }
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
    }).catch((result) => {
        res.status(400).send(err);
    });
});

router.get('/api/v1/volunteer/sponsors.json', (req, res) => {
    volunteer.fetchSponsors(req.session.user_uuid)
    .then((result) => {
        res.send(util.rsSuccess(result));
    })
    .catch((err) => {
        res.send(util.rsFailure({ errors: err, stack: err.stack }));
    });
});

module.exports = router;
