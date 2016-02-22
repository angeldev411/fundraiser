'use strict';
const express = require('express');
const router = express.Router();

const teamController = require('../team/controller');

router.post('/api/v1/team', (req, res) => {
    // TODO check rights

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
        console.log(err);
        res.status(400).send(err);
    });
});

module.exports = router;


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
