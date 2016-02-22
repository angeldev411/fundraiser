'use strict';
import { PROJECT_LEADER } from '../roles';
import UserController from '../controller';
import express from 'express';
const router = express.Router();

router.post('/api/v1/super-admin/invite', (req, res) => {
    return UserController.invite(req.body.email, PROJECT_LEADER)
    .then((user) => {
        if (user) {
            res.status(200).send(messages.invite.projectLeaderOk);
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
