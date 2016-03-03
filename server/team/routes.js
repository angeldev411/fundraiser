'use strict';
import express from 'express';
const router = express.Router();
import * as AUTH_CHECKER from '../auth/auth-checker';

import teamController from '../team/controller';
import Team from '../team/model';

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

    if (AUTH_CHECKER.isSuperAdmin(req.session.user)) {
        teamController.store(data, projectSlug, req.params.teamId)
        .then((response) => {
            res.status(200).send(response);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
    } else if (AUTH_CHECKER.isTeamLeader(req.session.user)) {
        // TODO verify if team leader is owner of team
        Team.isTeamLeaderTeamOwner(req.params.teamId, req.session.user.id)
        .then((response1) => {
            teamController.store(data, projectSlug, req.params.teamId)
            .then((response) => {
                res.status(200).send(response);
            })
            .catch((err) => {
                res.status(400).send(err);
            });
        })
        .catch(() => {
            res.status(403).send();
            return;
        });
    } else if (AUTH_CHECKER.isProjectLeader(req.session.user)) {
        // TODO verify if project leader is indirect owner of team
        Team.isProjectLeaderIndirectTeamOwner(req.params.teamId, req.session.user.id)
        .then(() => {
            teamController.store(data, projectSlug, req.params.teamId)
            .then((response) => {
                res.status(200).send(response);
            })
            .catch((err) => {
                res.status(400).send(err);
            });
        })
        .catch(() => {
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


// router.get("/api/v1/teams", function(req, res){
//     team.findPopular(req.params.short_name)
//     .then(function(data){
//         res.send(util.rsSuccess({teams: data}));
//     })
//     .catch(function(err){
//         console.log("error fetching teams by short name " + err);
//         res.send("error fetching teams " + JSON.stingify(err));
//     })
// });
//
// router.get("/api/v1/team/:short_name", function(req, res){
//     console.log("team short name " + req.params.short_name);
//     team.findByShortName(req.params.short_name)
//     .then(function(data){
//         res.send(JSON.stringify(data));
//     })
//     .catch(function(err){
//         res.send(JSON.stringify({error: err, stack: err.stack}));
//     });
// });
//
// /* just fetch all team members for teams I lead now */
// router.get("/api/v1/team/:team_short_name/volunteers", function(req, res){
//     team.fetchVolunteers(req.params.team_short_name)
//     .then(function(data){
//         res.send(util.rsSuccess({volunteers: data, team_short_name: req.params.team_short_name}));
//     })
//     .catch(function(err){
//         console.log(err)
//         res.send("error " + JSON.stringify(err));
//     });
// });
