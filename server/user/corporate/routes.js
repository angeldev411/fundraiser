'use strict';
import express from 'express';
const router = express.Router();

router.get("/api/v1/corporate/projects.json", function(req, res){

    project.findAll()
    .then(function(result){
        res.send(util.rsSuccess(result));
    })
    .catch(function(err){
        console.log("post method failure " + err + " " + err.stack);
        console.log(err);
        res.send(util.rsFailure(err));
    });

});

router.get("/api/v1/corporate/projects/:project_uuid.json", function(req, res){

    project.fetchAdminStats(req.params.project_uuid)
    .then(function(result){
        res.send(util.rsSuccess(result));
    })
    .catch(function(err){
        console.log("post method failure " + err + " " + err.stack);
        console.log(err);
        res.send(util.rsFailure(err));
    });
});


router.get("/api/v1/corporate/projects/:project_uuid/teams.json", function(req, res){

    project.findAllTeams(req.params.project_uuid)
    .then(function(result){
        res.send(util.rsSuccess(result));
    })
    .catch(function(err){
        console.log("post method failure " + err + " " + err.stack);
        console.log(err);
        res.send(util.rsFailure(err));
    });
});

router.get("/api/v1/corporate/teams/:team_short_name.json", function(req, res){

    corporate.fetchTeamStats(req.params.team_short_name)
    .then(function(result){
        res.send(util.rsSuccess(result));
    })
    .catch(function(err){
        console.log("get method failure fetchTeamStats " + err + " " + err.stack);
        console.log(err);
        res.send(util.rsFailure(err));
    });
});

router.post("/api/v1/corporate/teams/:team_short_name/update", function(req, res){
    corporate.updateTeam(req.body.team)
    .then(function(result){
        res.send(util.rsSuccess(result));
    })
    .catch(function(err){
        console.log(err);
        res.send(util.rsFailure(err));
    })

});



router.post("/api/v1/corporate/projects/:project_uuid/teams", function(req, res){
    var payload = req.body.data;

    payload.creator_uuid = req.session.user_uuid;

    console.log("got payload for corp team creation");
    console.log(payload);




    corporate.createTeam(payload)
    .then(function(result){
        res.send(util.rsSuccess(result));
    })
    .catch(function(err){
        console.log("post method failure " + err + " " + err.stack);
        console.log(err);
        res.send(util.rsFailure(err));
    });

});

//router.get("/api/v1/corporate/teams/:team_short_name.json", function(req, res){
//  console.log('fas controller');
//  team.fetchAdminStats(req.params.team_short_name)
//    .then(function(result){
//      res.send(util.rsSuccess(result));
//    })
//    .catch(function(err){
//      console.log("post method failure " + err + " " + err.stack);
//      console.log(err);
//      res.send(util.rsFailure(err));
//    });
//});



/* create project */
router.post("/api/v1/corporate/projects", function(req, res){

    // project.validate doesn't pass extra params so we can pass in all
    var data = req.body.data;
    data.creator_uuid = req.session.user_uuid;
    console.log(data);

    corporate.createProject(data)
    .then(function(result){
        res.send(util.rsSuccess(result));
    })
    .catch(function(err){
        console.log("post method failure " + err + " " + err.stack);
        console.log(err);
        res.send(util.rsFailure(err));
    });
});

router.get("/api/v1/corporate/teams/:team_short_name/invitations.json", function(req, res){

    team.fetchInvitations( {team_short_name: req.params.team_short_name} )
    .then(function(result){
        res.send(util.rsSuccess(result));
    })
    .catch(function(err){
        console.log("get method failure " + err + " " + err.stack);
        console.log(err);
        res.send(util.rsFailure(err));
    });

})

router.post("/api/v1/corporate/teams/:team_short_name/invite", function(req, res){
    var payload = req.body.data;
    payload.team_short_name = req.params.team_short_name;

    console.log("got payload for invite creation");
    console.log(payload);

    corporate.inviteUser(payload)
    .then(function(result){
        res.send(util.rsSuccess(result));
    })
    .catch(function(err){
        console.log("post method failure " + err + " " + err.stack);
        console.log(err);
        res.send(util.rsFailure(err));
    });

});
