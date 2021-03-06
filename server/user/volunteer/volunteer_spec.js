'use strict';
import config from '../../config';
import fixtures from '../../tests_helpers/fixtures';
import {
    loginAsSuperAdmin,
    loginAsProjectLeader,
    loginAsTeamLeader,
    loginAsVolunteer,
    logout,
    requestCookie,
} from '../../tests_helpers/helpers';

// test tools
const expect = require('chai').expect;

const project1 = fixtures.projects[0];
const project1Team = fixtures.teams[0];
const project1Volunteer = fixtures.volunteers[0];
const project2Volunteer = fixtures.volunteers[1];

describe('Volunteers', () => {
    describe('as Superadmin', () => {
        before(loginAsSuperAdmin);
        after(logout);

        it('lets a super admin list all volunteers', (done) => {
            requestCookie.get({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/volunteer`,
            },
            (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(200);
                expect(JSON.parse(body)).to.be.an('array');
                expect(JSON.parse(body)[0]).to.contain.keys('id');
                expect(JSON.parse(body)[0]).to.contain.keys('firstName');
                expect(JSON.parse(body)[0]).to.contain.keys('lastName');
                expect(JSON.parse(body)[0]).to.contain.keys('email');
                expect(JSON.parse(body)[0]).to.not.contain.keys('password');
                expect(JSON.parse(body)[0]).to.contain.keys('slug');
                expect(body).to.contain(project1Volunteer.email);
                expect(body).to.contain(project2Volunteer.email);
                done();
            });
        });
    });

    describe('as Project Leader', () => {
        before(loginAsProjectLeader);
        after(logout);

        it('lets a project leader list his project volunteers', (done) => {
            requestCookie.get({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/volunteer/${project1.slug}`,
            },
            (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(200);
                expect(JSON.parse(body)).to.be.an('array');
                expect(JSON.parse(body)[0]).to.contain.keys('id');
                expect(JSON.parse(body)[0]).to.contain.keys('firstName');
                expect(JSON.parse(body)[0]).to.contain.keys('lastName');
                expect(JSON.parse(body)[0]).to.contain.keys('email');
                expect(JSON.parse(body)[0]).to.contain.keys('slug');
                expect(body).to.contain(project1Volunteer.email);
                expect(body).to.not.contain(project2Volunteer.email);
                done();
            });
        });
    });

    describe('as Team Leader', () => {
        before(loginAsTeamLeader);
        after(logout);

        it('lets a team leader list his team volunteers', (done) => {
            requestCookie.get({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/volunteer/${project1.slug}/${project1Team.slug}`,
            },
            (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(200);
                expect(JSON.parse(body)).to.be.an('array');
                expect(JSON.parse(body)[0]).to.contain.keys('id');
                expect(JSON.parse(body)[0]).to.contain.keys('firstName');
                expect(JSON.parse(body)[0]).to.contain.keys('lastName');
                expect(JSON.parse(body)[0]).to.contain.keys('email');
                expect(JSON.parse(body)[0]).to.contain.keys('slug');
                expect(body).to.contain(project1Volunteer.email);
                expect(body).to.not.contain(project2Volunteer.email);
                done();
            });
        });
    });

    describe('as Volunteer', () => {
        before(loginAsVolunteer);
        after(logout);

        it('gives an error if a volunteer try to list volunteers', (done) => {
            requestCookie.get({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/volunteer`,
            },
            (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(404);
                done();
            });
        });

        it('gives updates my profile', (done) => {
            const url = `http://localhost:${config.EXPRESS_PORT}/api/v1/volunteer`;

            new Promise((resolve, reject) => {
                    requestCookie.put({
                        url,
                        form: {
                            email: project1Volunteer.email,
                            firstName: project1Volunteer.firstName,
                            lastName: project1Volunteer.lastName,
                            goal: 100,
                        },
                    },
                    (error, response, body) => {
                        // Should work on valid data
                        expect(response.statusCode).to.equal(200);
                        resolve();
                    });
            }).then((result) => {
                done();
            }).catch((error) => {
                fail();
                done();
            });
        });

        it('gives an error if I update my profile with empty data', (done) => {
            const url = `http://localhost:${config.EXPRESS_PORT}/api/v1/volunteer`;

            new Promise((resolve, reject) => {
                requestCookie.put({
                    url,
                },
                (error, response, body) => {
                    // Should succeed on no data
                    expect(response.statusCode).to.equal(200);
                    resolve();
                });
            }).then((result) => {
                done();
            }).catch((error) => {
                fail();
                done();
            });
        });

        it('gives an error if I update my profile with invalid email', (done) => {
            const url = `http://localhost:${config.EXPRESS_PORT}/api/v1/volunteer`;

            new Promise((resolve, reject) => {
                requestCookie.put({
                    url,
                    form: {
                        email: '11111',
                        firstName: project1Volunteer.firstName,
                        lastName: project1Volunteer.lastName,
                    },
                },
                (error, response, body) => {
                    // Should fail on invalid email
                    expect(response.statusCode).to.equal(400);
                    resolve();
                });
            }).then((result) => {
                done();
            }).catch((error) => {
                fail();
                done();
            });
        });

        it('gives an error if I update my profile with invalid too big goal', (done) => {
            const url = `http://localhost:${config.EXPRESS_PORT}/api/v1/volunteer`;

            new Promise((resolve, reject) => {
                requestCookie.put({
                    url,
                    form: {
                        email: project1Volunteer.email,
                        firstName: project1Volunteer.firstName,
                        lastName: project1Volunteer.lastName,
                        goal: 10000,
                    },
                },
                (error, response, body) => {
                    // Should fail on invalid email
                    expect(response.statusCode).to.equal(400);
                    resolve();
                });
            }).then((result) => {
                done();
            }).catch((error) => {
                fail();
                done();
            });
        });

        it('gives an error if I update my profile with invalid too small goal', (done) => {
            const url = `http://localhost:${config.EXPRESS_PORT}/api/v1/volunteer`;

            new Promise((resolve, reject) => {
                requestCookie.put({
                    url,
                    form: {
                        email: project1Volunteer.email,
                        firstName: project1Volunteer.firstName,
                        lastName: project1Volunteer.lastName,
                        goal: -111,
                    },
                },
                (error, response, body) => {
                    // Should fail on invalid email
                    expect(response.statusCode).to.equal(400);
                    resolve();
                });
            }).then((result) => {
                done();
            }).catch((error) => {
                fail();
                done();
            });
        });

        it('gives an error if I update my profile with invalid string instead of int goal', (done) => {
            const url = `http://localhost:${config.EXPRESS_PORT}/api/v1/volunteer`;

            new Promise((resolve, reject) => {
                requestCookie.put({
                    url,
                    form: {
                        email: project1Volunteer.email,
                        firstName: project1Volunteer.firstName,
                        lastName: project1Volunteer.lastName,
                        goal: 'whatever',
                    },
                },
                (error, response, body) => {
                    // Should fail on invalid email
                    expect(response.statusCode).to.equal(400);
                    resolve();
                });
            }).then((result) => {
                done();
            }).catch((error) => {
                fail();
                done();
            });
        });
    });
});
