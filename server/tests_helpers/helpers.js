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
    requestCookie.post({
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
    requestCookie.post({
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
    requestCookie.post({
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
    requestCookie.post({
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
    requestCookie.get({
        url: `http://localhost:${config.EXPRESS_PORT}/api/v1/auth/logout`,
    }, (error, response) => {
        expect(response.statusCode).to.equal(200);
        done();
    });
};

export const deleteUserInviteesByEmail = (done) => {
    // Remove the user we just invited
    return Promise.resolve(
        db.query(
            `
            MATCH (user:USER {email: {email}})-[rel:VOLUNTEER]->(team:TEAM {slug: {teamSlug}})
            DELETE rel
            DELETE user
            `,
            {},
            {
                email: fixtures.invite,
                teamSlug: fixtures.teams[1].slug,
            }
        )
    ).then((response) => {
        return Promise.resolve(
            db.query(
                `
                MATCH (user:USER {email: {email}})-[rel:VOLUNTEER]->(team:TEAM {slug: {teamSlug}})
                DELETE rel
                DELETE user
                `,
                {},
                {
                    email: fixtures.newUser.email,
                    teamSlug: fixtures.teams[2].slug
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

export const createTestProject = (done) => {
    requestCookie.post({
        url: `http://localhost:${config.EXPRESS_PORT}/api/v1/project`,
        form: {
            name: fixtures.testProject.name,
            slug: fixtures.testProject.slug,
        },
    },
    (error, response, body) => {
        expect(error).to.be.a('null');
        expect(response.statusCode).to.equal(200);
        expect(JSON.parse(body)).to.contain.keys('name');
        expect(JSON.parse(body)).to.contain.keys('slug');
        done();
    });
};

export const deleteTestProject = (done) => {
    // Remove the project we just created
    return Promise.resolve(
        db.query(
            `
            MATCH (project:PROJECT {name: {name}})
            DETACH DELETE project
            `,
            {},
            {
                name: fixtures.testProject.name,
            }
        )
    ).then((response) => {
        done();
    })
    .catch((err) => {
        console.log('FAIL', err);
    });
};

export const getTestProjectId = (name) => {
    return db.query(
        `
        MATCH (project:PROJECT {name: {name}})
        RETURN project
        `,
        {},
        {
            name,
        }
    )
    .getResult('project');
};

export const deleteTestTeam = (done) => {
    // Remove the team we just created
    return Promise.resolve(
        db.query(
            `
            MATCH (team:TEAM {name: {name}})
            DETACH DELETE team
            `,
            {},
            {
                name: fixtures.testTeam.name,
            }
        )
    ).then((response) => {
        done();
    })
    .catch((err) => {
        console.log('FAIL', err);
    });
};

export const getTestTeamId = (name) => {
    return db.query(
        `
        MATCH (team:TEAM {name: {name}})
        RETURN team
        `,
        {},
        {
            name
        }
    )
    .getResult('team');
};

export const deleteTestSponsor = (done) => {
    // Remove the sponsor we just created
    return Promise.resolve(
        db.query(
            `
            MATCH (sponsor:SPONSOR {email: {email}})
            DETACH DELETE sponsor
            `,
            {},
            {
                email: fixtures.testSponsor.email,
            }
        )
    ).then((response) => {
        done();
    })
    .catch((err) => {
        console.log('FAIL', err);
    });
};
