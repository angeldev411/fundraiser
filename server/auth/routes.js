'use strict';
const express = require('express');
const util = require('../helpers/util');
const messages = require('../messages');
const router = express.Router();

const userController = require('../user/controller');

router.post('/api/v1/login', (req, res) => {
    const credentials = {
        email: req.body.email,
        password: util.hash(req.body.password),
    };

    console.log(credentials);

    userController.checkCredentials(credentials)
    .then((user) => {
        console.log('credentials passed got uuid' + user.uuid);
        req.session.userUUID = user.uuid;

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

        req.session.userUUID = null;
        res.status('401').send({
            status: 'error',
            message: 'invalid login credentials'
        });
    });
});

router.post('/api/v1/logout', (req, res) => {
    req.session.userUUID = null;
    res.send(messages.logout);
});

router.post('/api/v1/reset_password', (req, res) => {
    userController.resetPassword(req.body.email)
    .then((token) => {
        res.status(200).send(messages.resetPassword.success);
    })
    .catch((err) => {
        res.status(500).send(`${messages.resetPassword.error}: ${err}`);
    });
});

module.exports = router;
