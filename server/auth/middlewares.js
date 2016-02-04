'use strict';
const user = require('./models/user');

/* Security Middlewares  */
const requireLogin = (req, res, next) => {
    if (req.session.user_uuid) {
        next();
    } else {
        res.status(401).send('Must log in');
        res.end();
    }
};

// this doesn't really do anything yet
const loadUser = (req, res, next) => {
    if (req.session && req.session.user_uuid) {
        user.findByUuid(req.session.user_uuid)
        .then(function(uuid) {
            next();
        })
        .catch(next);
    } else {
        next();
    }
};

const requireVolunteer = (req, res, next) => {
    const roles = [`team_${req.params.uuid}_volunteer`];

    const authorized = roles.some((role) => req.roles[role]);

    if (authorized) {
        next();
    } else {
        res.status(401).send('Not authorized by role');
    }
};

const requireTeamLeader = (req, res, next) => {
    const roles = [`team_${req.params.uuid}_leader`];

    const authorized = roles.some((role) => req.roles[role]);

    if (authorized) {
        next();
    } else {
        res.status(401)
            .send(`User not authorized by role, needs ${JSON.stringify(roles)} has ${JSON.stringify(req.roles)}`);
    }
};

const requireSuperAdmin = (req, res, next) => {
    const roles = [
        `project_${req.params.uuid}_creator`,
        `project_${req.params.uuid}_admin`,
        `project_${req.params.uuid}_super_admin`,
    ];

    const authorized = roles.some((role) => req.roles[role]);

    if (authorized) {
        next();
    } else {
        res.status(401).send('Not authorized by role');
    }
};


// TODO convert to standard json error structure
const loadRoles = (req, res, next) => {
    user.rolesForUuid(req.session.user_uuid)
    .then(function(roles) {
        console.log(roles)
        req.roles = roles;
        next();
    })
    .catch(function(err) {
        res.status(401).send('Error Fetching Roles ' + err);
        res.end();
    });
};
