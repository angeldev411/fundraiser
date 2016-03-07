'use strict';
import express from 'express';
const router = express.Router();
import * as AUTH_CHECKER from '../auth/auth-checker';
import mailer from '../helpers/mailer';

router.post('/api/v1/email', (req, res) => {
    console.log('Hello mailer');
    if (
        !AUTH_CHECKER.isLogged(req.session)
        || !AUTH_CHECKER.isTeamLeader(req.session.user)
    ) {
        res.status(404).send();
        return;
    }

    const content = {
        subject: req.body.subject,
        body: req.body.message,
    };

    mailer.sendEmail(content, (response) => {
        res.status(200).send(response);
    }, (err) => {
        res.status(400).send(err);
    });
});

module.exports = router;
