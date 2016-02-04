'use strict';
const express = require('express');
const util = require('../helpers/util');
const messages = require('../messages');
const router = express.Router();

const userController = require('../controllers/user');

router.post('/api/v1/login', (req, res) => {
    const credentials = {
        email: req.body.email,
        password: util.hash(req.body.password),
    };

    console.log(credentials);

    userController.checkCredentials(credentials)
    .then((user) => {
        console.log('credentials passed got uuid' + user.uuid);
        req.session.user_uuid = user.uuid;

        res.status(200).send({
            message: messages.login.success,
            payload: userController.safe(user),
        });

        // TODO: replace this with something that just returns 'volunteer', 'leader', etc.
        user.rolesForUuid(uuid)
        .then((roles) => {
            payload.roles = roles;
            res.send(JSON.stringify(payload));
        });
    })
    .catch((err) => {
        console.error('credentials failed ' + err);

        req.session.user_uuid = null;
        res.status('401').send({
            status: 'error',
            message: 'invalid login credentials'
        });
    });
});

router.post('/api/v1/logout', (req, res) => {
    req.session.user_uuid = null;
    res.send('OK');
});

router.post('/api/v1/reset_password', (req, res) => {
    user.resetPassword(req.body.email)
    .then((token) => {
        const payload = util.rsSuccess({ message: 'Password Reset Email Sent' });

        res.send(JSON.stringify(payload));
    })
    .catch((err) => {
        res.send(`error ${err}`);
    });
});

module.exports = router;
