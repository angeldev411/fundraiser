'use strict';
import { VOLUNTEER } from '../roles';
import UserController from '../controller';
import express from 'express';
const router = express.Router();

router.post('/api/v1/team-leader/invite', (req, res) => {
    UserController.invite(req.body.email, VOLUNTEER, req.body.teamSlug)
    .then((user) => {
        if (user) {
            res.status(200).send(messages.invite.volunteerOk);
            return;
        }
        res.status(500).send(messages.invite.error);
        return;
    })
    .catch((err) => {
        res.status(500).send(messages.invite.error);
        return;
    });
});

export default router;
