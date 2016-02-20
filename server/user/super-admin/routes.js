'use strict';
import { PROJECT_LEADER } from '../roles';
import UserController from '../controller';

router.post('/api/v1/super-admin/invite', (req, res) => {
    return UserController.invite(req.body.email, PROJECT_LEADER)
    .then((user) => {
        if (user) {
            res.status(200).send(messages.invite.projectLeaderOk);
        }
        res.status(500).send(messages.invite.error);
    })
    .catch((err) => {
        res.status(500).send(messages.invite.error);
    });
});
