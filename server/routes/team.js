
router.get("/api/v1/teams", function(req, res){
    team.findPopular(req.params.short_name)
    .then(function(data){
        res.send(util.rsSuccess({teams: data}));
    })
    .catch(function(err){
        console.log("error fetching teams by short name " + err);
        res.send("error fetching teams " + JSON.stingify(err));
    })
});

router.get("/api/v1/team/:short_name", function(req, res){
    console.log("team short name " + req.params.short_name);
    team.findByShortName(req.params.short_name)
    .then(function(data){
        res.send(JSON.stringify(data));
    })
    .catch(function(err){
        res.send(JSON.stringify({error: err, stack: err.stack}));
    });
});

/* just fetch all team members for teams I lead now */
router.get("/api/v1/team/:team_short_name/volunteers", function(req, res){
    team.fetchVolunteers(req.params.team_short_name)
    .then(function(data){
        res.send(util.rsSuccess({volunteers: data, team_short_name: req.params.team_short_name}));
    })
    .catch(function(err){
        console.log(err)
        res.send("error " + JSON.stringify(err));
    });
});
