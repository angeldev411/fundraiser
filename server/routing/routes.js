import user from './models/user';
import donation from './models/donation';
import pledge from './models/pledge';
import team from './models/team';
import leader from './models/leader';
import util from './models/util';
import volunteer from './models/volunteer';
import login from './models/login';
import project from './models/project';
import corporate from './models/corporate';

/* App + Settings  */

var app = module.exports.app = exports.app = express();

app.use(express.static('public'));
// app.use(multer({ dest: './uploads/'}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


//app.use(session({
//  secret: 'fuze23232323t',
//  cookie: { maxAge: 60000000 },
//  saveUninitialized: true,
//  resave: false}));

app.use(session({
    cookieName: 'session',
    secret: 'rsn0telll33333',
    duration: 720 * 60 * 60 * 1000,
    activeDuration: 1000 * 60 * 5,
    cookie: {
        ephemeral: false
    }
}));


/* Security rules for paths */

app.all('*', loadUser);
app.all('/api/v1/session*', loadUser, loadRoles);
app.all('/api/v1/volunteer/*', requireLogin, loadUser, loadRoles); // gets you a dashboard
app.all('/api/v1/leader/*', requireLogin, loadUser, loadRoles); // lets you edit team stuff, approve hours.
app.all('/api/v1/corporate/*', requireLogin, loadUser, loadRoles);


// isomorphic




/* ROUTES START HERE */

/* PUBLIC */

/* LOGIN  LOGOUT */

app.get("/api/v1/session", (req, res) => {
    res.send(JSON.stringify(req.session));
});

app.get("/api/v1/test3", (req, res) => {
    res.send("logged in!");
});


app.get("/api/v1/session.json", (req, res) => {
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

app.post('/api/v1/reset_password', (req, res) => {
    user.resetPassword(req.body.email)
    .then(function(token){
        var payload = util.rsSuccess({message: "Password Reset Email Sent"});
        res.send(JSON.stringify(payload));
    })
    .catch(function(err){
        res.send("error " + err);
    })
});

app.post("/api/v1/logout", (req, res) => {
    req.session.user_uuid = null;
    res.send("OK");
})

app.post("/api/v1/login", (req, res) => {
    const creds = {email: req.body.email, password: req.body.password};
    console.log(creds);

    login.validate(creds)
    .then(login.checkCredentials)
    .then(function(uuid){
        console.log('credentials passed got uuid' + uuid);
        req.session.user_uuid = uuid;
        var payload = util.rsSuccess({user_uuid: uuid, message: "Successful login"});

        // TODO: replace this with something that just returns "volunteer", "leader", etc.
        user.rolesForUuid(uuid)
        .then(function(roles){
            payload.roles = roles
            res.send(JSON.stringify(payload));
        })
    })
    .catch(function(err){
        console.error("credentials failed " + err);
        req.session.user_uuid = null;
        res.status("401").send(JSON.stringify({status: 'error', message: "invalid login credentials"}))
    });

});


app.post("/api/v1/sessions/destroy", (req, res) => {
    // delete session cookie
    // possibly add something to the graph db.
});

/* Onboarding stuff */

// not sure if necessary
app.get("/api/v1/onboard/:code.json", function(req, res){
    res.send("OK");
});

app.post("/api/v1/onboard/volunteer", function(req, res){
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

app.post("/api/v1/onboard/leader/:invite_uuid", function(req, res){

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

/* PROJECT AND TEAM FETCHES */

// All projects
app.get("/api/v1/projects.json", function(req, res){

});

app.get("/api/v1/teams/:short_name.json", function(req, res){
    console.log("team short name " + req.params.short_name);
    team.findByShortName(req.params.short_name)
    .then(function(data){
        res.send(JSON.stringify(data));
    })
    .catch(function(err){
        res.send(JSON.stringify({error: err, stack: err.stack}));
    });
});

// rename fetch to find
app.get("/api/v1/volunteers/:uuid.json", function(req, res){
    volunteer.fetchByUuid(req.params.uuid)
    .then(function(data){
        res.send(util.rsSuccess({volunteer: data}));
    })
    .catch(function(err){
        console.log("error fetching volunteer by uuid " + err);
        res.send("error fetching voluneer " + err);
    })
});

app.get("/api/v1/teams.json", function(req, res){
    team.findPopular(req.params.short_name)
    .then(function(data){
        res.send(util.rsSuccess({teams: data}));
    })
    .catch(function(err){
        console.log("error fetching teams by short name " + err);
        res.send("error fetching teams " + JSON.stingify(err));
    })
});

/* just fetch all team members for teams I lead now */
app.get("/api/v1/teams/:team_short_name/volunteers.json", function(req, res){
    team.fetchVolunteers(req.params.team_short_name)
    .then(function(data){
        res.send(util.rsSuccess({volunteers: data, team_short_name: req.params.team_short_name}));
    })
    .catch(function(err){
        console.log(err)
        res.send("error " + JSON.stringify(err));
    });
});



/* just fetch all team members for teams I lead now */
app.get("/api/v1/leader/volunteers.json", function(req, res){
    team.fetchVolunteersILead(req.session.user_uuid)
    .then(function(data){
        res.send(util.rsSuccess({volunteers: data}));
    })
    .catch(function(err){
        console.log(err)
        res.send("error " + JSON.stringify(err));
    });
});


// Pledge
app.post('/api/v1/pledge', function(req, res){
    console.log("got pledge");
    console.log(req.body)

    pledge.create(req.body)
    .then(function(result){
        console.log(" post server plege OK");
        res.send(util.rsSuccess(result));
    })
    .catch(function(err){
        console.log("post server pledge err " + err);
        var payload = util.rsFailure({errors: err});
        console.log(payload);
        res.send(payload);
    })
})

// Donate, not used yet
app.post('/api/v1/donate/:team', function(req, res) {
    console.log('donate called');
    console.log(req.body);

    let result =
    donation.validate(req.body) // util.parseJSON(req.body)
    .then(donation.validateUniqueEmail)
    .then(donation.createStripeProfile)
    .then(donation.insertIntoDb)
    .catch((err) => {
        let result = JSON.stringify({errors: err});
        res.send(result);
    })
    .then((obj)=> {
        req.session.user_uuid = obj.new_uuid;
        res.send("success");
    });
});





/* AUTH REQUIRED */

/* ADMIN */


app.get("/api/v1/volunteer/sponsors.json", function(req, res){
    volunteer.fetchSponsors(req.session.user_uuid)
    .then(function(result){
        res.send(util.rsSuccess(result));
    })
    .catch(function(err){
        res.send(util.rsFailure({errors: err, stack: err.stack}));
    });
});

app.get("/api/v1/leader/teams.json", function(req, res){
    leader.fetchTeams(req.session.user_uuid)
    .then(function(result){
        res.send(util.rsSuccess(result));
    })
    .catch(function(err){
        res.send(util.rsFailure({errors: err, stack: err.stack}));
    })

});

app.get("/api/v1/leader/:team_short_name/service.json", function(req, res){
    leader.findServiceNeedingApprovalForTeam({team_short_name: req.params.team_short_name, user_uuid: req.session.user_uuid})
    .then(function(result){
        res.send(JSON.stringify(result));
    })
    .catch(function(err){
        res.send("the error is " + err);
    })

});

app.get("/api/v1/leader/service.json", function(req, res){
    leader.findAllServiceNeedingApproval({user_uuid: req.session.user_uuid})
    .then(function(result){
        res.send(JSON.stringify(result));
    })
    .catch(function(err){
        res.send("the error is " + err);
    })

});


app.post("/api/v1/leader/approve", function(req, res){

    console.log(req);

    var payload = req.body;
    payload.leader_uuid = req.session.user_uuid;

    leader.approveService(payload)
    .then(function(){

        res.send("approved!")
    })
    .catch(function(err){
        res.send("not approved " + err)
    })
});


app.post("/api/v1/leader/:short_name/volunteers.json", function(req, res){
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

/* corporate admin */

app.get("/api/v1/corporate/projects.json", function(req, res){

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

app.get("/api/v1/corporate/projects/:project_uuid.json", function(req, res){

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


app.get("/api/v1/corporate/projects/:project_uuid/teams.json", function(req, res){

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

app.get("/api/v1/corporate/teams/:team_short_name.json", function(req, res){

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

app.post("/api/v1/corporate/teams/:team_short_name/update", function(req, res){
    corporate.updateTeam(req.body.team)
    .then(function(result){
        res.send(util.rsSuccess(result));
    })
    .catch(function(err){
        console.log(err);
        res.send(util.rsFailure(err));
    })

});



app.post("/api/v1/corporate/projects/:project_uuid/teams", function(req, res){
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

//app.get("/api/v1/corporate/teams/:team_short_name.json", function(req, res){
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
app.post("/api/v1/corporate/projects", function(req, res){

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

app.get("/api/v1/corporate/teams/:team_short_name/invitations.json", function(req, res){

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

app.post("/api/v1/corporate/teams/:team_short_name/invite", function(req, res){
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



/* Volunteer Stuff */

app.get("/api/v1/leading_teams.json", function(req, res){
    user.leadingTeams(req.session.user_uuid)
    .then(function(result){
        console.log("successful volunteer teams fetch");
        res.send(util.rsSuccess(result));
    })
    .catch(function(err){
        console.error("post received: errors " + err);
        res.send(JSON.stringify(util.rsFailure(err)));
    })

});

app.get("/api/v1/volunteering_for_teams.json", function(req, res){
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

app.get("/api/v1/volunteer/my_stats.json", function(req, res){
    res.send('vols path working');
});

app.post("/api/v1/volunteer/record_hours", function(req, res){
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

app.get('/api/v1/test', function(req, res) {
    console.log("stdout test");s
    console.error("err test");
    res.send("hello");
});



module.exports = app;
