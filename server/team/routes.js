'use strict';
import express from 'express';
const router = express.Router();
import * as AUTH_CHECKER from '../auth/auth-checker';
import uuid from 'uuid';
import teamController from '../team/controller';
import Team from '../team/model';
import messages from '../messages';

router.post('/api/v1/team', (req, res) => {
    if (
        !AUTH_CHECKER.isLogged(req.session)
        || (
            !AUTH_CHECKER.isProjectLeader(req.session.user)
            && !AUTH_CHECKER.isSuperAdmin(req.session.user)
        )
    ) {
        res.status(404).send();
        return;
    }

    const team = {
        name: req.body.name,
        slug: req.body.slug,
        teamLeaderEmail: req.body.teamLeaderEmail,
    };

    const data = {
        team,
        currentUser: req.session.user,
    };

    const projectSlug = req.body.projectSlug;

    teamController.store(data, projectSlug)
    .then((response) => {
        res.status(200).send(response);
    })
    .catch((err) => {
        res.status(400).send(err);
    });
});

router.put('/api/v1/team/:teamId', (req, res) => {
    if (
        !AUTH_CHECKER.isLogged(req.session)
        || (
            !AUTH_CHECKER.isSuperAdmin(req.session.user)
            && !AUTH_CHECKER.isProjectLeader(req.session.user)
            && !AUTH_CHECKER.isTeamLeader(req.session.user)
        )
    ) {
        res.status(404).send();
        return;
    }
    const team = req.body.team;
    const data = {
        team,
        currentUser: req.session.user,
    };

    if (!team.id) {
        res.status(400).send(messages.team.id);
        return;
    }

    if (AUTH_CHECKER.isSuperAdmin(req.session.user)) {
        teamController.update(data)
        .then((response) => {
            req.session.user.team = team;
            res.status(200).send(response);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
    } else if (AUTH_CHECKER.isTeamLeader(req.session.user)) {
        // TODO verify if team leader is owner of team
        Team.isTeamLeaderTeamOwner(team.id, req.session.user.id)
        .then((result) => {
            teamController.update(data)
            .then((response) => {
                req.session.user.team = team;
                res.status(200).send(response);
            })
            .catch((err) => {
                res.status(400).send(err);
            });
        })
        .catch((error) => {
            res.status(403).send();
            return;
        });
    } else if (AUTH_CHECKER.isProjectLeader(req.session.user)) {
        Team.isProjectLeaderIndirectTeamOwner(team.id, req.session.user.id)
        .then((result) => {
            teamController.update(data)
            .then((response) => {
                req.session.user.team = team;
                res.status(200).send(response);
            })
            .catch((err) => {
                res.status(400).send(err);
            });
        })
        .catch((error) => {
            res.status(403).send();
            return;
        });
    }
});

router.get('/api/v1/team/:projectSlug', (req, res) => {
    if (
        !AUTH_CHECKER.isLogged(req.session)
        || (
            !AUTH_CHECKER.isProjectLeader(req.session.user)
        )
    ) {
        res.status(404).send();
        return;
    }

    if (!req.params.projectSlug) {
        res.status(404).send();
        return;
    }
    Team.getByProject(req.session.user.id, req.params.projectSlug)
    .then((teams) => {
        if (!teams[0]) {
            res.status(404).send();
            return
        }
        res.status(200).send(teams);
        return;
    })
    .catch((err) => {
        res.status(404).send();
        return;
    });
});

router.get('/api/v1/team/:projectSlug/:teamSlug', (req, res) => {
    if (!req.params.projectSlug || !req.params.teamSlug) {
        res.status(404).send();
        return;
    }
    Team.getBySlugs(req.params.projectSlug, req.params.teamSlug)
    .then((team) => {
        res.status(200).send(team);
        return;
    })
    .catch((err) => {
        res.status(404).send();
        return;
    });
});


export default router;
