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

app.get('/api/v1/session', (req, res) => {
    res.send(JSON.stringify(req.session));
});

app.get('/api/v1/session.json', (req, res) => {
    const payload = util.rsSuccess({ message: 'Logged In' });
    let userUUID = null;

    if (typeof (req.session.userUUID) !== 'undefined') {
        userUUID = req.session.userUUID;
    }

    user.roleMapForUuid(userUUID)
    .then((roles) => {
        if (roles.length > 0) {
            const result = util.rsSuccess({
                roles,
                userUUID,
            });

            res.send(JSON.stringify(result));
        } else {
            res.status('401').send('NOT LOGGED IN');
        }
    })
    .catch((err) => {
        res.status('401').send(`NOT LOGGED IN WITH ERROR: ${err}`);
    });
});

app.post('/api/v1/reset_password', (req, res) => {
    user.resetPassword(req.body.email)
    .then((token) => {
        const payload = util.rsSuccess({ message: 'Password Reset Email Sent' });

        res.send(JSON.stringify(payload));
    })
    .catch((err) => {
        res.send('error ' + err);
    });
});

app.post('/api/v1/logout', (req, res) => {
    req.session.userUUID = null;
    res.send('OK');
});

app.post('/api/v1/login', (req, res) => {
    const creds = {
        email: req.body.email,
        password: req.body.password,
    };

    console.log(creds);

    login.validate(creds)
    .then(login.checkCredentials)
    .then((uuid) => {
        console.log('credentials passed got uuid' + uuid);
        req.session.userUUID = uuid;
        var payload = util.rsSuccess({ userUUID: uuid, message: 'Successful login' });

        // TODO: replace this with something that just returns 'volunteer', 'leader', etc.
        return user.rolesForUuid(uuid);
    })
    .then((roles) => {
        payload.roles = roles;
        res.send(JSON.stringify(payload));
    })
    .catch((err) => {
        console.error('credentials failed ' + err);
        req.session.userUUID = null;
        res.status('401').send(JSON.stringify({
            status: 'error',
            message: 'invalid login credentials',
        }));
    });
});

app.post('/api/v1/sessions/destroy', (req, res) => {
    // delete session cookie
    // possibly add something to the graph db.
});

/* Onboarding stuff */

// not sure if necessary
app.get('/api/v1/onboard/:code.json', (req, res) => {
    res.send('OK');
});

app.post('/api/v1/onboard/volunteer', (req, res) => {
    console.log('onboard volunteer');
    const obj = {
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        goal: req.body.goal,
        team_short_name: req.body.team_short_name,
        password: req.body.password,
        headshot_data: req.body.headshot_data,
    };

    console.log('onboard action got ' + JSON.stringify(obj));

    // TODO validate this
    user.uploadHeadshotImage(obj)
    .then(volunteer.onboard)
    .then((data) => {
        console.log('creating volunteeer db returned:');
        console.log(data);
        // we log the user in.
        req.session.userUUID = data.uuid;
        res.send(util.rsSuccess({ volunteer: data }));
    })
    .catch((err) => {
        const errPayload = util.rsFailure({ errors: err });

        console.log(err);
        console.log(err.stack);
        res.send(errPayload);
    })
});

app.post('/api/v1/onboard/leader/:invite_uuid', (req, res) => {
    const obj = {
        email: req.body.email,
        invite_uuid: req.body.invite_uuid,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: req.body.password,
    };

    console.log('got ' + JSON.stringify(obj));

    leader.onboard(obj)
    .then((data) => {
        // we log the user in.
        console.log('data is');
        console.log(data);
        req.session.userUUID = data.uuid;
        res.send(util.rsSuccess({ leader: data }));
    })
    .catch((err) => {
        console.log(err);
        console.log(err.stack);
        const errPayload = util.rsFailure({ errors: err });
        console.log(errPayload);
        res.send(errPayload);
    });
});

/* PROJECT AND TEAM FETCHES */

// All projects
app.get('/api/v1/projects.json', (req, res) => {
    // TODO
});

app.get('/api/v1/teams/:short_name.json', (req, res) => {
    console.log('team short name ' + req.params.short_name);

    team.findByShortName(req.params.short_name)
    .then((data) => {
        res.send(JSON.stringify(data));
    })
    .catch((err) => {
        res.send(JSON.stringify({ error: err, stack: err.stack }));
    });
});

// rename fetch to find
app.get('/api/v1/volunteers/:uuid.json', (req, res) => {
    volunteer.fetchByUuid(req.params.uuid)
    .then((data) => {
        res.send(util.rsSuccess({ volunteer: data }));
    })
    .catch((err) => {
        console.log('error fetching volunteer by uuid ' + err);
        res.send('error fetching voluneer ' + err);
    });
});

app.get('/api/v1/teams.json', (req, res) => {
    team.findPopular(req.params.short_name)
    .then((data) => {
        res.send(util.rsSuccess({ teams: data }));
    })
    .catch((err) => {
        console.log('error fetching teams by short name ' + err);
        res.send('error fetching teams ' + JSON.stingify(err));
    });
});

/* just fetch all team members for teams I lead now */
app.get('/api/v1/teams/:team_short_name/volunteers.json', (req, res) => {
    team.fetchVolunteers(req.params.team_short_name)
    .then((data) => {
        res.send(util.rsSuccess({ volunteers: data, team_short_name: req.params.team_short_name }));
    })
    .catch((err) => {
        console.log(err)
        res.send('error ' + JSON.stringify(err));
    });
});

/* just fetch all team members for teams I lead now */
app.get('/api/v1/leader/volunteers.json', (req, res) => {
    team.fetchVolunteersILead(req.session.userUUID)
    .then((data) => {
        res.send(util.rsSuccess({ volunteers: data }));
    })
    .catch((err) => {
        console.log(err);
        res.send('error ' + JSON.stringify(err));
    });
});


// Pledge
app.post('/api/v1/pledge', (req, res) => {
    console.log('got pledge');
    console.log(req.body);

    pledge.create(req.body)
    .then((result) => {
        console.log(' post server plege OK');
        res.send(util.rsSuccess(result));
    })
    .catch((err) => {
        console.log('post server pledge err ' + err);
        const payload = util.rsFailure({ errors: err });

        console.log(payload);
        res.send(payload);
    });
});

// Donate, not used yet
app.post('/api/v1/donate/:team', (req, res) => {
    console.log('donate called');
    console.log(req.body);

    donation.validate(req.body) // util.parseJSON(req.body)
    .then(donation.validateUniqueEmail)
    .then(donation.createStripeProfile)
    .then(donation.insertIntoDb)
    .catch((err) => {
        const result = JSON.stringify({ errors: err });

        res.send(result);
    })
    .then((obj) => {
        req.session.userUUID = obj.new_uuid;
        res.send('success');
    });
});

/* AUTH REQUIRED */

/* ADMIN */
app.get('/api/v1/volunteer/sponsors.json', (req, res) => {
    volunteer.fetchSponsors(req.session.userUUID)
    .then((result) => {
        res.send(util.rsSuccess(result));
    })
    .catch((err) => {
        res.send(util.rsFailure({ errors: err, stack: err.stack }));
    });
});

app.get('/api/v1/leader/teams.json', (req, res) => {
    leader.fetchTeams(req.session.userUUID)
    .then((result) => {
        res.send(util.rsSuccess(result));
    })
    .catch((err) => {
        res.send(util.rsFailure({ errors: err, stack: err.stack}));
    });
});

app.get('/api/v1/leader/:team_short_name/service.json', (req, res) => {
    leader.findServiceNeedingApprovalForTeam({
        team_short_name: req.params.team_short_name,
        userUUID: req.session.userUUID,
    })
    .then((result) => {
        res.send(JSON.stringify(result));
    })
    .catch((err) => {
        res.send('the error is ' + err);
    });
});

app.get('/api/v1/leader/service.json', (req, res) => {
    leader.findAllServiceNeedingApproval({ userUUID: req.session.userUUID })
    .then((result) => {
        res.send(JSON.stringify(result));
    })
    .catch((err) => {
        res.send('the error is ' + err);
    });
});

app.post('/api/v1/leader/approve', (req, res) => {
    console.log(req);

    const payload = req.body;

    payload.leader_uuid = req.session.userUUID;

    leader.approveService(payload)
    .then(() => {
        res.send('approved!');
    })
    .catch((err) => {
        res.send(`not approved: ${err}`);
    });
});

app.post('/api/v1/leader/:short_name/volunteers.json', (req, res) => {
    const obj = req.body;

    obj.team_short_name = req.params.short_name;
    obj.bio = '';
    obj.project_statement = '';

    console.log('posting:');
    console.log(obj);

    volunteer.create(obj)
    .then((result) => {
        console.log('post method success');
        console.log(result);
        res.send(util.rsSuccess(result));
    })
    .catch((err) => {
        console.log('post method failure ' + err + ' ' + err.stack);
        console.log(err);
        res.send(util.rsFailure(err));
    });
});

/* corporate admin */

app.get('/api/v1/corporate/projects.json', (req, res) => {
    project.findAll()
    .then((result) => {
        res.send(util.rsSuccess(result));
    })
    .catch((err) => {
        console.log('post method failure ' + err + ' ' + err.stack);
        console.log(err);
        res.send(util.rsFailure(err));
    });
});

app.get('/api/v1/corporate/projects/:project_uuid.json', (req, res) => {
    project.fetchAdminStats(req.params.project_uuid)
    .then((result) => {
        res.send(util.rsSuccess(result));
    })
    .catch((err) => {
        console.log('post method failure ' + err + ' ' + err.stack);
        console.log(err);
        res.send(util.rsFailure(err));
    });
});

app.get('/api/v1/corporate/projects/:project_uuid/teams.json', (req, res) => {
    project.findAllTeams(req.params.project_uuid)
    .then((result) => {
        res.send(util.rsSuccess(result));
    })
    .catch((err) => {
        console.log('post method failure ' + err + ' ' + err.stack);
        console.log(err);
        res.send(util.rsFailure(err));
    });
});

app.get('/api/v1/corporate/teams/:team_short_name.json', (req, res) => {
    corporate.fetchTeamStats(req.params.team_short_name)
    .then((result) => {
        res.send(util.rsSuccess(result));
    })
    .catch((err) => {
        console.log('get method failure fetchTeamStats ' + err + ' ' + err.stack);
        console.log(err);
        res.send(util.rsFailure(err));
    });
});

app.post('/api/v1/corporate/teams/:team_short_name/update', (req, res) => {
    corporate.updateTeam(req.body.team)
    .then((result) => {
        res.send(util.rsSuccess(result));
    })
    .catch((err) => {
        console.log(err);
        res.send(util.rsFailure(err));
    });
});

app.post('/api/v1/corporate/projects/:project_uuid/teams', (req, res) => {
    const payload = req.body.data;

    payload.creator_uuid = req.session.userUUID;

    console.log('got payload for corp team creation');
    console.log(payload);

    corporate.createTeam(payload)
    .then((result) => {
        res.send(util.rsSuccess(result));
    })
    .catch((err) => {
        console.log('post method failure ' + err + ' ' + err.stack);
        console.log(err);
        res.send(util.rsFailure(err));
    });
});

// app.get('/api/v1/corporate/teams/:team_short_name.json', (req, res) => {
//   console.log('fas controller');
//   team.fetchAdminStats(req.params.team_short_name)
//     .then((result) => {
//       res.send(util.rsSuccess(result));
//     })
//     .catch((err) => {
//       console.log('post method failure ' + err + ' ' + err.stack);
//       console.log(err);
//       res.send(util.rsFailure(err));
//     });
// });

/* create project */
app.post('/api/v1/corporate/projects', (req, res) => {
    // project.validate doesn't pass extra params so we can pass in all
    const data = req.body.data;

    data.creator_uuid = req.session.userUUID;
    console.log(data);

    corporate.createProject(data)
    .then((result) => {
        res.send(util.rsSuccess(result));
    })
    .catch((err) => {
        console.log('post method failure ' + err + ' ' + err.stack);
        console.log(err);
        res.send(util.rsFailure(err));
    });
});

app.get('/api/v1/corporate/teams/:team_short_name/invitations.json', (req, res) => {
    team.fetchInvitations({
        team_short_name: req.params.team_short_name
    })
    .then((result) => {
        res.send(util.rsSuccess(result));
    })
    .catch((err) => {
        console.log('get method failure ' + err + ' ' + err.stack);
        console.log(err);
        res.send(util.rsFailure(err));
    });
});

app.post('/api/v1/corporate/teams/:team_short_name/invite', (req, res) => {
    const payload = req.body.data;

    payload.team_short_name = req.params.team_short_name;

    console.log('got payload for invite creation');
    console.log(payload);

    corporate.inviteUser(payload)
    .then((result) => {
        res.send(util.rsSuccess(result));
    })
    .catch((err) => {
        console.log('post method failure ' + err + ' ' + err.stack);
        console.log(err);
        res.send(util.rsFailure(err));
    });
});

/* Volunteer Stuff */

app.get('/api/v1/leading_teams.json', (req, res) => {
    user.leadingTeams(req.session.userUUID)
    .then((result) => {
        console.log('successful volunteer teams fetch');
        res.send(util.rsSuccess(result));
    })
    .catch((err) => {
        console.error('post received: errors ' + err);
        res.send(JSON.stringify(util.rsFailure(err)));
    });
});

app.get('/api/v1/volunteering_for_teams.json', (req, res) => {
    user.volunteeringForTeams(req.session.userUUID)
    .then((result) => {
        console.log(`Successful volunteer teams fetch ${req.session.userUUID}`);
        res.send(util.rsSuccess(result));
    })
    .catch((err) => {
        console.error(`Post received: errors ${err}`);
        res.send(JSON.stringify(util.rsFailure(err)));
    });
});

app.get('/api/v1/volunteer/my_stats.json', (req, res) => {
    res.send('vols path working');
});

app.post('/api/v1/volunteer/record_hours', (req, res) => {
    console.error('record hours');
    const data = req.body.data;

    data.userUUID = req.session.userUUID;

    console.error(data);

    volunteer.logService(data)
    .then((result) => {
        console.log('successful log service');
        console.log(util.rsSuccess(result));
        res.send(util.rsSuccess(result));
    })
    .catch((err) => {
        console.error('post received: errors ' + err);
        res.send(JSON.stringify(util.rsFailure(err)));
    });
});

app.get('/api/v1/test', (res) => {
    console.log('stdout test');
    console.error('err test');
    res.send('hello');
});

export default app;
