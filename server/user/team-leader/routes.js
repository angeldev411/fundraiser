'use strict';
import UserController from '../controller';
import express from 'express';
const router = express.Router();

router.post('/api/v1/teamLeader/invite', (req, res) => {
    UserController.invite(req.body.email)
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
