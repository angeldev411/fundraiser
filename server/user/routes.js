'use strict';
import userController from './controller';
import express from 'express';
const router = express.Router();
import util from '../helpers/util';
import messages from '../messages';

router.post('/api/v1/signup', (req, res) => {
    if (!req.body.email || !req.body.firstName || !req.body.lastName || !req.body.password || (!req.body.inviteCode && !req.body.teamSlug)) {
        res.status(400).send(messages.signup.missingData);
        return;
    }

    const data = {
        inviteCode: req.body.inviteCode,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: util.hash(req.body.password),
    };
    // goal is only required for team members. If the signup form didn't require it,
    // ensure we aren't passing it in undefined.  
    if (req.body.goal) data.goal = req.body.goal;
    
    let slug = req.body.teamSlug || '';

    userController.signup(data, slug.toLowerCase())
    .then((user) => {
        req.session.user = user;
        res.status(200).send(userController.safe(user));
    })
    .catch((err) => {
        res.status(500).send(err);
    });
});

router.get('/api/v1/user/:slug', (req, res) => {
    userController.getVolunteer(req.params.slug.toLowerCase())
    .then((user) => {
        res.status(200).send(userController.safe(user));
    })
    .catch((err) => {
        res.status(404).send(err);
    });
});

router.post('/api/v1/user/reset-password', (req, res) => {
    if (!req.body.email) {
        res.status(400).send(messages.signup.missingData);
        return;
    }

    userController.resetPassword(req.body.email)
    .then(() => {
        res.status(200).send(true);
    })
    .catch((err) => {
        res.status(500).send(err);
    });
});

router.put('/api/v1/user/reset-password', (req, res) => {
    if (!req.body.resetToken || !req.body.password) {
        res.status(400).send(messages.signup.missingData);
        return;
    }

    userController.updatePassword(req.body.resetToken, util.hash(req.body.password))
    .then((user) => {
        res.status(200).send(userController.safe(user));
    })
    .catch((err) => {
        res.status(500).send(err);
    });
});

router.put('/api/v1/user/make-volunteer', (req, res) => {
  const user    = req.body;
  const teamId  = req.body.team.id;
  userController.makeVolunteer(user, teamId)
  .then( (user) => userController.getUserWithRoles(user.id) )
  .then( (user) => userController.getRequiredSession(user) )
  .then( (user) => {
    req.session.user = user;
    res.status(200).send( userController.safe(user) ); 
  })
  .catch( (err) => res.status(500).send(err) );
})

export default router;
