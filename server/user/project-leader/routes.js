'use strict';
import { TEAM_LEADER } from '../roles';
import UserController from '../controller';
import express from 'express';
const router = express.Router();

router.post('/api/v1/project-leader/invite', (req, res) => {
    return UserController.invite(req.body.email, TEAM_LEADER, req.body.teamSlug)
    .then((user) => {
        if (user) {
            res.status(200).send(messages.invite.teamLeaderOk);
        }
        res.status(500).send(messages.invite.error);
    })
    .catch((err) => {
        res.status(500).send(messages.invite.error);
    });
});

export default router;
