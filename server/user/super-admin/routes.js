'use strict';
import { PROJECT_LEADER } from '../roles';
import UserController from '../controller';
import express from 'express';
const router = express.Router();

//FIXME: determine if this is still used
router.post('/api/v1/super-admin/project/invite', (req, res) => {
    return UserController.invite(req.body.email, PROJECT_LEADER, req.body.projectSlug)
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
//FIXME: determine if this is still used
router.post('/api/v1/super-admin/team/invite', (req, res) => {
    return UserController.invite(req.body.email, PROJECT_LEADER, req.body.teamSlug)
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

router.post('/api/v1/super-admin/execute/monthly/payments', (req, res) => {
    console.log('yo monthly payments!');
    res.status(200).send('it worked');
    // return UserController.invite(req.body.email, PROJECT_LEADER, req.body.teamSlug)
    // .then((user) => {
    //     if (user) {
    //         res.status(200).send(messages.invite.projectLeaderOk);
    //         return;
    //     }
    //     res.status(500).send(messages.invite.error);
    //     return;
    // })
    // .catch((err) => {
    //     res.status(500).send(messages.invite.error);
    //     return;
    // });
});

router.post('/api/v1/super-admin/execute/reset/hours', (req, res) => {
    console.log('yo reset hours!');
    res.status(200).send('it worked');
    // return UserController.invite(req.body.email, PROJECT_LEADER, req.body.teamSlug)
    // .then((user) => {
    //     if (user) {
    //         res.status(200).send(messages.invite.projectLeaderOk);
    //         return;
    //     }
    //     res.status(500).send(messages.invite.error);
    //     return;
    // })
    // .catch((err) => {
    //     res.status(500).send(messages.invite.error);
    //     return;
    // });
});

export default router;
