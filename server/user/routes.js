'use strict';
import userController from './controller';

router.post('/api/v1/signup', (req, res) => {
    const data = {
        inviteCode: req.body.invitecode,
        email: req.body.email,
        password: req.body.password,
    };

    console.log('onboard action got ' + JSON.stringify(obj));

    return userController.signup(data)
    .then((user) => {

    });
});
