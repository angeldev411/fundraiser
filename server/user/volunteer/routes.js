'use strict';
import UserController from '../controller';

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

module.exports = router;
