'use strict';
router.get("/api/v1/leader/teams", function(req, res){
    leader.fetchTeams(req.session.user_uuid)
    .then(function(result){
        res.send(util.rsSuccess(result));
    })
    .catch(function(err){
        res.send(util.rsFailure({errors: err, stack: err.stack}));
    })

});

router.get("/api/v1/leader/:team_short_name/service", function(req, res){
    leader.findServiceNeedingApprovalForTeam({team_short_name: req.params.team_short_name, user_uuid: req.session.user_uuid})
    .then(function(result){
        res.send(JSON.stringify(result));
    })
    .catch(function(err){
        res.send("the error is " + err);
    })

});

router.get("/api/v1/leader/service", function(req, res){
    leader.findAllServiceNeedingApproval({user_uuid: req.session.user_uuid})
    .then(function(result){
        res.send(JSON.stringify(result));
    })
    .catch(function(err){
        res.send("the error is " + err);
    })

});

router.post("/api/v1/leader/routerrove", function(req, res){

    console.log(req);

    var payload = req.body;
    payload.leader_uuid = req.session.user_uuid;

    leader.routerroveService(payload)
    .then(function(){

        res.send("routerroved!")
    })
    .catch(function(err){
        res.send("not routerroved " + err)
    })
});


router.post("/api/v1/leader/:short_name/volunteers", function(req, res){
    var obj = req.body;
    obj.team_short_name = req.params.short_name;
    obj.bio = "";
    obj.project_statement = "";


    console.log("posting:");
    console.log(obj);

    volunteer.create(obj)
    .then(function(result){
        console.log("post method success");
        console.log(result);
        res.send(util.rsSuccess(result));

    })
    .catch(function(err){
        console.log("post method failure " + err + " " + err.stack);
        console.log(err);
        res.send(util.rsFailure(err));
    });

});
