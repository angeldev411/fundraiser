'use strict';
import express from 'express';
const router = express.Router();
import hoursController from '../../hours/controller';

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

module.exports = router;
