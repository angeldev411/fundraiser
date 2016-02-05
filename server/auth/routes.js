'use strict';
const express = require('express');
const util = require('../helpers/util');
const messages = require('../messages');
const router = express.Router();

const userController = require('../user/controller');

router.post('/api/v1/login', (req, res) => {
    if (!req.body.password) {
        res.status(400).send(messages.login.passwordEmpty);
        return;
    }
    if (!req.body.email) {
        res.status(400).send(messages.login.emailEmpty);
        return;
    }

    const credentials = {
        email: req.body.email,
        password: util.hash(req.body.password),
    };

    userController.checkCredentials(credentials)
    .then((user) => {
        console.log(`Credentials passed got uuid: ${user.uuid}`);
        req.session.userUUID = user.uuid;

        res.status(200).send({
            message: messages.login.success,
            payload: userController.safe(user),
        });

        // TODO: replace this with something that just returns 'volunteer', 'leader', etc.
        // user.rolesForUuid(uuid)
        // .then((roles) => {
        //     payload.roles = roles;
        //     res.send(JSON.stringify(payload));
        // });
    })
    .catch((err) => {
        console.error(`Credentials failed: ${err}`);

        req.session.userUUID = null;
        res.status(400).send(err);
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
