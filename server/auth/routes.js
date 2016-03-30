'use strict';
import express from 'express';
import util from '../helpers/util';
import messages from '../messages';
const router = express.Router();
import * as AUTH_CHECKER from '../auth/auth-checker';
import * as roles from '../user/roles';
import userController from '../user/controller';

router.post('/api/v1/auth/login', (req, res) => {
    if (!req.body.password || !req.body.email) {
        res.status(401).send(messages.login.failed);
        return;
    }

    const credentials = {
        email: req.body.email,
        password: util.hash(req.body.password),
    };

    userController.checkCredentials(credentials)
    .then((user) => {
        if (!user.id) {
            // This shouldn't happen but who knows
            res.status(500).send();
            return;
        }

        if (!req.body.remember) {
            // If remember me is not checked, set cookie for browsing session only
            req.session.cookie.expires = false;
        }

        req.session.user = user;

        res.status(200).send(userController.safe(user));
    })
    .catch((err) => {
        req.session.user = null;
        res.status(401).send(err);
    });
});

router.get('/api/v1/auth/whoami', (req, res) => {
    if (req.session.user) {
        res.send(userController.safe(req.session.user));
    } else {
        res.status(404).send();
    }
});

router.get('/api/v1/auth/logout', (req, res) => {
    req.session.destroy();
    res.status(200).send(messages.logout);
});

router.get('/api/v1/auth/switch', (req, res) => {
    if (
        !AUTH_CHECKER.isLogged(req.session)
        || (
            !req.session.user.lastUser
            && !AUTH_CHECKER.isSuperAdmin(req.session.user.lastUser)
            && !AUTH_CHECKER.isProjectLeader(req.session.user)
        )
    ) {
        res.status(404).send();
        return;
    }

    if (req.session.user.lastUser) {
        req.session.user = req.session.user.lastUser;
        res.redirect('/dashboard');
    } else {
        res.status(401).send(messages.login.failed);
    }
});

router.get('/api/v1/auth/switch/:id', (req, res) => {
    if (
        !AUTH_CHECKER.isLogged(req.session)
        || (
            !AUTH_CHECKER.isSuperAdmin(req.session.user)
            && !AUTH_CHECKER.isProjectLeader(req.session.user)
        )
    ) {
        res.status(404).send();
        return;
    }

    if (AUTH_CHECKER.isSuperAdmin(req.session.user)) {
        userController.getUserWithRoles(req.params.id)
        .then((user) => {
            return userController.getRequiredSession(user);
        })
        .then((user) => {
            const lastUser = req.session.user;

            req.session.user = user;
            req.session.user.lastUser = lastUser;
            res.redirect('/dashboard');
        })
        .catch((err) => {
            res.send(err);
        });
    } else if (AUTH_CHECKER.isProjectLeader(req.session.user)) {
        userController.getProjectRelatedUser(req.params.id, req.session.user.project.slug)
        .then((user) => {
            return userController.getUserWithRoles(user.id);
        })
        .then((user) => {
            return userController.getRequiredSession(user);
        })
        .then((user) => {
            const lastUser = req.session.user;

            req.session.user = user;
            req.session.user.lastUser = lastUser;
            res.redirect('/dashboard');
        })
        .catch((err) => {
            res.send(err);
        });
    } else {
        res.status(404).send();
        return;
    }
});

router.post('/api/v1/auth/reset_password', (req, res) => {
    userController.resetPassword(req.body.email)
    .then((token) => {
        res.status(200).send(messages.resetPassword.success);
    })
    .catch((err) => {
        res.status(500).send(`${messages.resetPassword.error}: ${err}`);
    });
});

export default router;
