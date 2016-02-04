router.get("/api/v1/session", (req, res) => {
    res.send(JSON.stringify(req.session));
});

router.get("/api/v1/session", (req, res) => {
    var payload = util.rsSuccess({message: "Logged In"});

    var user_uuid = null;
    if(typeof(req.session.user_uuid) != 'undefined'){
        user_uuid = req.session.user_uuid;
    }

    user.roleMapForUuid(user_uuid)
    .then(function(roles){
        if(roles.length > 0){
            var result = util.rsSuccess({roles: roles, user_uuid: user_uuid});
            res.send(JSON.stringify(result));
        }else{
            res.status("401").send("NOT LOGGED IN");
        }
    })
    .catch(function(err){
        res.status("401").send("NOT LOGGED IN WITH ERROR: " + err);
    })
});

router.post("/api/v1/sessions/destroy", (req, res) => {
    // delete session cookie
    // possibly add something to the graph db.
});
