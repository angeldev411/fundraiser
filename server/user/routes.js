'use strict';
import userController from './controller';
import express from 'express';
const router = express.Router();

router.post('/api/v1/signup', (req, res) => {
    const data = {
        inviteCode: req.body.invitecode,
        email: req.body.email,
        password: req.body.password,
    };

    console.log('onboard action got ', obj);

    return userController.signup(data)
    .then((user) => {
        res.status(200).send(userController.safe(user));
    })
    .catch((err) => {
        res.status(500).send(err);
    });
});

router.get('/api/v1/user/:volunteerID', (req, res) => {
    return userController.getVolunteer(req.params.volunteerID)
    .then((user) => {
        res.status(200).send(userController.safe(user));
    })
    .catch((err) => {
        res.status(404).send();
    });
});

export default router;
