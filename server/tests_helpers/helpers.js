import fixtures from './fixtures';
import config from '../config';
import request from 'request';
export const requestCookie = request.defaults({ jar: true });
const expect = require('chai').expect;
const db = require('neo4j-simple')(config.DB_URL);
import Promise from 'bluebird';

const superAdmin = fixtures.superAdmins[0];
const teamLeader = fixtures.teamLeaders[0];
const projectLeader = fixtures.projectLeaders[0];
const volunteer = fixtures.volunteers[0];

export const loginAsSuperAdmin = (done) => {
    request.post({
        url: `http://localhost:${config.EXPRESS_PORT}/api/v1/auth/login`,
        form: {
            email: superAdmin.email,
            password: superAdmin.password,
        },
    }, (rerror, response) => {
        expect(response.statusCode).to.equal(200);
        done();
    });
};

export const loginAsProjectLeader = (done) => {
    request.post({
        url: `http://localhost:${config.EXPRESS_PORT}/api/v1/auth/login`,
        form: {
            email: projectLeader.email,
            password: projectLeader.password,
        },
    }, (rerror, response) => {
        expect(response.statusCode).to.equal(200);
        done();
    });
};

export const loginAsTeamLeader = (done) => {
    request.post({
        url: `http://localhost:${config.EXPRESS_PORT}/api/v1/auth/login`,
        form: {
            email: teamLeader.email,
            password: teamLeader.password,
        },
    }, (rerror, response) => {
        expect(response.statusCode).to.equal(200);
        done();
    });
};

export const loginAsVolunteer = (done) => {
    request.post({
        url: `http://localhost:${config.EXPRESS_PORT}/api/v1/auth/login`,
        form: {
            email: volunteer.email,
            password: volunteer.password,
        },
    }, (error, response, body) => {
        expect(response.statusCode).to.equal(200);
        done();
    });
};

export const logout = (done) => {
    request.get({
        url: `http://localhost:${config.EXPRESS_PORT}/api/v1/auth/logout`,
    }, (error, response) => {
        expect(response.statusCode).to.equal(200);
        request.defaults({ jar: false });
        done();
    });
};

export const deleteUserInviteesByEmail = (done) => {
    // Remove the user we just invited
    return Promise.resolve(
        db.query(
            `
            MATCH (user:USER {email: {email}})
            DELETE user
            `,
            {},
            {
                email: fixtures.invite,
            }
        )
    ).then((response) => {
        return Promise.resolve(
            db.query(
                `
                MATCH (user:USER {email: {email}})
                DELETE user
                `,
                {},
                {
                    email: fixtures.newUser.email,
                }
            )
        );
    }).then((Something) => {
        done();
    })
    .catch((err) => {
        console.log('FAIL', err);
    });
};
