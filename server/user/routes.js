'use strict';
import userController from './controller';
import express from 'express';
const router = express.Router();
import util from '../helpers/util';

router.post('/api/v1/signup', (req, res) => {
    if (!req.body.email || !req.body.password || (!req.body.inviteCode && !req.body.teamSlug)) {
        res.status(400).send(messages.signup.missingData);
        return;
    }

    const data = {
        inviteCode: req.body.inviteCode,
        email: req.body.email,
        password: util.hash(req.body.password),
    };

    console.log('onboard action got ', data, req.body, req.params);

    userController.signup(data, req.body.teamSlug)
    .then((user) => {
        res.status(200).send(userController.safe(user));
    })
    .catch((err) => {
        res.status(500).send(err);
    });
});

router.get('/api/v1/user/:slug', (req, res) => {
    userController.getVolunteer(req.params.slug)
    .then((user) => {
        res.status(200).send(userController.safe(user));
    })
    .catch((err) => {
        res.status(404).send();
    });
});

export default router;
