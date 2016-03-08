'use strict';
import express from 'express';
const router = express.Router();
import * as AUTH_CHECKER from '../auth/auth-checker';
import Mailer from '../helpers/mailer';
import Team from '../team/model';
import Volunteer from '../user/volunteer/model';
import messages from '../messages';

router.post('/api/v1/email/:projectSlug/:teamSlug', (req, res) => {
    if (
        !AUTH_CHECKER.isLogged(req.session)
        || !AUTH_CHECKER.isTeamLeader(req.session.user)
    ) {
        res.status(404).send();
        return;
    }

    if (
        Object.keys(req.body).length === 0
        || !req.body.subject
        || req.body.subject === ''
        || !req.body.message
        || req.body.message === ''
    ) {
        res.status(400).send(messages.email.required);
        return;
    }

    const content = {
        subject: req.body.subject,
        body: req.body.message,
    };

    // Verify team leader is team owner
    Team.isTeamLeaderTeamOwnerBySlug(req.params.teamSlug, req.session.user.id)
    .then(() => {
        if (!req.body.recipients > 0) { // If no recipients defined
            // Send to entire team
            Volunteer.getVolunteers(req.params.projectSlug, req.params.teamSlug)
            .then((volunteers) => {
                Mailer.sendEmail(content, volunteers, (response) => {
                    res.status(200).send(response);
                }, (err) => {
                    console.log(err);
                    res.status(400).send();
                });
            }).catch((errorVolunteers) => {
                console.log(errorVolunteers);
                res.status(500).send('You should not be here');
            });
        } else {
            const volunteersIds = [];

            for (let i = 0; i < req.body.recipients.length; i++) {
                volunteersIds.push(req.body.recipients[i].id);
            }

            Volunteer.getVolunteersByIds(req.params.projectSlug, req.params.teamSlug, volunteersIds)
            .then((volunteers) => {
                Mailer.sendEmail(content, volunteers, (response) => {
                    res.status(200).send(response);
                }, (err) => {
                    console.log(err);
                    res.status(400).send();
                });
            }).catch((errorVolunteers) => {
                console.log(errorVolunteers);
                res.status(500).send('You should not be here');
            });
        }
    })
    .catch((err) => {
        console.log(err);
        res.status(400).send('You are not authorized to send an email to volunteers of this team');
    });
});

module.exports = router;
