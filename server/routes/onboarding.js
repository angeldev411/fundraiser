'use strict';
// not sure if necessary
router.get("/api/v1/onboard/:code.json", function(req, res){
    res.send("OK");
});

router.post("/api/v1/onboard/volunteer", function(req, res){
    console.log("onboard volunteer");
    var obj = {email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        goal: req.body.goal,
        team_short_name: req.body.team_short_name,
        password: req.body.password,
        headshot_data: req.body.headshot_data
    };

    console.log("onboard action got " + JSON.stringify(obj));

    // TODO validate this
    user.uploadHeadshotImage(obj)
    .then(volunteer.onboard)
    .then(function(data){
        console.log('creating volunteeer db returned:');
        console.log(data);
        // we log the user in.
        req.session.user_uuid = data.uuid;
        res.send(util.rsSuccess({volunteer: data}));
    })
    .catch(function(err){
        var errPayload = util.rsFailure({errors: err});
        console.log(err);
        console.log(err.stack);
        res.send(errPayload);
    })
});

router.post("/api/v1/onboard/leader/:invite_uuid", function(req, res){

    var obj = {email: req.body.email,
        invite_uuid: req.body.invite_uuid,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: req.body.password
    };

    console.log("got " + JSON.stringify(obj));

    leader.onboard(obj)
    .then(function(data){
        // we log the user in.
        console.log("data is");
        console.log(data);
        req.session.user_uuid = data.uuid;
        res.send(util.rsSuccess({leader: data}));
    })
    .catch(function(err){
        console.log(err);
        console.log(err.stack);
        var errPayload = util.rsFailure({errors: err});
        console.log(errPayload);
        res.send(errPayload);
    })
});
