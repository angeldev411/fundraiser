'use strict';

router.get("/api/v1/volunteers/:uuid.json", function(req, res){
    volunteer.fetchByUuid(req.params.uuid)
    .then(function(data){
        res.send(util.rsSuccess({volunteer: data}));
    })
    .catch(function(err){
        console.log("error fetching volunteer by uuid " + err);
        res.send("error fetching voluneer " + err);
    })
});

/* just fetch all team members for teams I lead now */
router.get("/api/v1/leader/volunteers.json", function(req, res){
    team.fetchVolunteersILead(req.session.user_uuid)
    .then(function(data){
        res.send(util.rsSuccess({volunteers: data}));
    })
    .catch(function(err){
        console.log(err)
        res.send("error " + JSON.stringify(err));
    });
});

router.get("/api/v1/volunteering_for_teams.json", function(req, res){
    user.volunteeringForTeams(req.session.user_uuid)
    .then(function(result){
        console.log("successful volunteer teams fetch " + req.session.user_uuid);
        res.send(util.rsSuccess(result));
    }.bind(this))
    .catch(function(err){
        console.error("post received: errors " + err);
        res.send(JSON.stringify(util.rsFailure(err)));
    })

});

router.get("/api/v1/volunteer/my_stats.json", function(req, res){
    res.send('vols path working');
});

router.post("/api/v1/volunteer/record_hours", function(req, res){
    console.error("record hours");
    var data = req.body.data;
    data.user_uuid = req.session.user_uuid;

    console.error(data);

    volunteer.logService(data)
    .then(function(result){
        console.log("successful log service");
        console.log(util.rsSuccess(result));
        res.send(util.rsSuccess(result));
    })
    .catch(function(err){
        console.error("post received: errors " + err);
        res.send(JSON.stringify(util.rsFailure(err)));
    })


})

router.get("/api/v1/volunteer/sponsors.json", function(req, res){
    volunteer.fetchSponsors(req.session.user_uuid)
    .then(function(result){
        res.send(util.rsSuccess(result));
    })
    .catch(function(err){
        res.send(util.rsFailure({errors: err, stack: err.stack}));
    });
});
