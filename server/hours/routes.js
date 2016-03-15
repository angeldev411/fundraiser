'use strict';
import express from 'express';
const router = express.Router();
import * as AUTH_CHECKER from '../auth/auth-checker';
import hoursController from './controller';
import Hours from './model';
import UserController from '../user/controller';

router.post('/api/v1/hours', (req, res) => {
    if (
        !AUTH_CHECKER.isLogged(req.session)
        || !AUTH_CHECKER.isVolunteer(req.session.user)
    ) {
        res.status(404).send();
        return;
    }

    let hour = {
        hours: req.body.hours,
        signatureData: req.body.signature,
        place: req.body.place,
        date: req.body.date,
        supervisorName: req.body.supervisor,
        approved: false,
    };

    // Is approval required?
    Hours.isApprovalRequired(req.session.user.id)
    .then((required) => {
        if (!required) {
            hour.approved = true;
        }

        hoursController.log(req.session.user.id, hour).then((result) => {
            res.status(200).send(result);
            return;
        }).catch((err) => {
            res.status(400).send(err);
            return;
        });
    })
    .catch((err) => {
        res.status(400).send(err);
        return;
    })
});

router.get('/api/v1/hours', (req, res) => {
    if (
        !AUTH_CHECKER.isLogged(req.session)
        || !AUTH_CHECKER.isVolunteer(req.session.user)
    ) {
        res.status(404).send();
        return;
    }

    UserController.getUserWithHours(req.session.user.id).then((result) => {
        res.status(200).send(result);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

router.put('/api/v1/hours/:id', (req, res) => {
    if (
        !AUTH_CHECKER.isLogged(req.session) ||
        !AUTH_CHECKER.isTeamLeader(req.session.user)
    ) {
        res.status(404).send();
        return;
    }

    const hourId = req.params.id;

    UserController.userCanApproveHour(req.session.user.id, hourId)
        .then((isUserAllowed) => {
            if (!isUserAllowed) {
                res.status(403).send();
            }
            hoursController.approve(hourId)
                .then(() => {
                    res.status(200).send();
                })
                .catch((err) => {
                    res.status(400).send(err);
                });
        })
        .catch((err) => {
            res.status(403).send(err);
        });
});

router.get('/api/v1/hours-team/:teamid', (req, res) => {
    if (
        !AUTH_CHECKER.isLogged(req.session) ||
        !AUTH_CHECKER.isTeamLeader(req.session.user)
    ) {
        res.status(404).send();
        return;
    }

    const teamId = req.params.teamid;

    UserController.userOwnsTeam(req.session.user.id, teamId)
        .then((isUserOwningTeam) => {
            if (!isUserOwningTeam) {
                res.status(403).send(err);
                return;
            }
            hoursController.getHoursNotApproved(
                teamId,
            ).then((result) => {
                res.status(200).send(result);
            }).catch((err) => {
                res.status(400).send(err);
            });
        })
        .catch(() => {
            res.status(403).send(err);
        });
});

module.exports = router;
