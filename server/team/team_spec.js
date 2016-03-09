'use strict';
import fixtures from '../tests_helpers/fixtures';
import config from '../config';
import messages from '../messages';
import uuid from 'uuid';
import request from 'request';
import {
    loginAsSuperAdmin,
    loginAsProjectLeader,
    loginAsTeamLeader,
    loginAsVolunteer,
    logout,
    createTestProject,
    deleteTestProject,
    getTestTeamId,
    deleteTestTeam,
    requestCookie,
} from '../tests_helpers/helpers';

// test tools
const expect = require('chai').expect;

const project = fixtures.projects[0];
const team = fixtures.teams[0];
const otherProject = fixtures.projects[1];
const otherProjectTeam = fixtures.teams[1];

describe('Team', () => {
    before(loginAsSuperAdmin);
    before(createTestProject);
    after(deleteTestProject);
    after(logout);

    it('gives a 200 if the team exists', (done) => {
        request.get({
            url: `http://localhost:${config.EXPRESS_PORT}/api/v1/team/${project.slug}/${team.slug}`,
        },
        (error, response, body) => {
            expect(error).to.be.a('null');
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
    it('gives a 404 if the team does not exist', (done) => {
        request.get({
            url: `http://localhost:${config.EXPRESS_PORT}/api/v1/team/123456789123456789/dkshkjghkjdfh`,
        },
        (error, response, body) => {
            expect(error).to.be.a('null');
            expect(response.statusCode).to.equal(404);
            done();
        });
    });
    it('gives a 404 if the request is not valid', (done) => {
        request.get({
            url: `http://localhost:${config.EXPRESS_PORT}/api/v1/team/123456789123456789`,
        },
        (error, response, body) => {
            expect(error).to.be.a('null');
            expect(response.statusCode).to.equal(404);
            done();
        });
    });

    describe('as SuperAdmin and Project Leader', () => {
        it('gives an error if the team slug already exists in the database', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/team`,
                form: {
                    name: team.name,
                    slug: team.slug,
                },
            }, (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(400);
                expect(body).to.equal(messages.team.required);
                done();
            });
        });

        it('gives an error if a super admin tries to create team with an empty name', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/team`,
                form: {
                    name: '',
                    slug: 'test',
                },
            }, (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(400);
                expect(body).to.equal(messages.team.required);
                done();
            });
        });

        it('gives an error if a super admin tries to create team with an empty slug', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/team`,
                form: {
                    name: 'test',
                    slug: '',
                },
            }, (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(400);
                expect(body).to.equal(messages.team.required);
                done();
            });
        });

        it('gives an error if a super admin tries to create team with an malformed email', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/team`,
                form: {
                    name: 'test',
                    slug: 'test',
                    teamLeaderEmail: 'test',
                },
            }, (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(400);
                expect(body).to.equal(messages.notEmail);
                done();
            });
        });
    });

    describe('as SuperAdmin', () => {
        before(loginAsSuperAdmin);
        after(deleteTestTeam);
        after(logout);

        it('lets a super admin create team', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/team`,
                form: {
                    name: fixtures.testTeam.name,
                    slug: uuid.v4(), // Create a unique slug
                    projectSlug: project.slug,
                },
            },
            (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(200);
                expect(JSON.parse(body)).to.contain.keys('name');
                expect(JSON.parse(body)).to.contain.keys('slug');
                done();
            });
        });

        it('lets a super admin update team', (done) => {
            getTestTeamId(fixtures.testTeam.name)
            .then((testTeam) => {
                requestCookie.put({
                    url: `http://localhost:${config.EXPRESS_PORT}/api/v1/team/${team.id}`,
                    form: {
                        team: {
                            id: testTeam.id,
                            name: fixtures.testTeam.name,
                            slug: uuid.v4()
                        },
                    },
                },
                (error, response, body) => {
                    expect(error).to.be.a('null');
                    expect(response.statusCode).to.equal(200);
                    expect(JSON.parse(body)).to.contain.keys('name');
                    expect(JSON.parse(body)).to.contain.keys('slug');
                    done();
                });
            });
        });
    });

    describe('as ProjectLeader', () => {
        before(loginAsProjectLeader);
        after(logout);

        it('lets a Project Leader create team', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/team`,
                form: {
                    name: fixtures.testTeam.name,
                    slug: uuid.v4(), // Create a unique slug
                    projectSlug: project.slug,
                },
            },
            (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(200);
                expect(JSON.parse(body)).to.contain.keys('name');
                expect(JSON.parse(body)).to.contain.keys('slug');
                done();
            });
        });

        it('lets a Project Leader update team', (done) => {
            getTestTeamId(fixtures.testTeam.name)
            .then((testTeam) => {
                requestCookie.put({
                    url: `http://localhost:${config.EXPRESS_PORT}/api/v1/team/${team.id}`,
                    form: {
                        team: {
                            id: testTeam.id,
                            name: fixtures.testTeam.name,
                            slug: uuid.v4(),
                            projectSlug: project.slug,
                        },
                    },
                },
                (error, response, body) => {
                    expect(error).to.be.a('null');
                    expect(response.statusCode).to.equal(200);
                    expect(JSON.parse(body)).to.contain.keys('name');
                    expect(JSON.parse(body)).to.contain.keys('slug');
                    done();
                });
            });
        });

        it('gives a 403 if the Project Leader is not indirect owner of Team', (done) => {
            getTestTeamId(otherProjectTeam.name)
            .then((testTeam) => {
                requestCookie.put({
                    url: `http://localhost:${config.EXPRESS_PORT}/api/v1/team/${team.id}`,
                    form: {
                        team: {
                            id: testTeam.id,
                            name: otherProjectTeam.name,
                            slug: uuid.v4(),
                            projectSlug: otherProject.slug,
                        },
                    },
                },
                (error, response, body) => {
                    expect(error).to.be.a('null');
                    expect(response.statusCode).to.equal(403);
                    done();
                });
            })
        });

        it('lets a Project Leader list his project teams', (done) => {
            requestCookie.get({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/team/${project.slug}`,
            },
            (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(200);
                expect(JSON.parse(body)).to.be.an('array');
                expect(JSON.parse(body)[0]).to.contain.keys('name');
                expect(JSON.parse(body)[0]).to.contain.keys('slug');
                expect(body).to.contain(team.name);
                expect(body).to.not.contain(otherProjectTeam.name);
                done();
            });
        });

        it('gives a 404 if the project does not belongs to connected Project Leader', (done) => {
            requestCookie.get({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/team/${otherProject.slug}`,
            },
            (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(404);
                expect(body).to.be.empty;
                done();
            });
        });

        it('gives a 404 if the project does not exist', (done) => {
            requestCookie.get({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/team/sdgfhgfh`,
            },
            (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(404);
                expect(body).to.be.empty;
                done();
            });
        });
    });

    describe('as Team Leader', () => {
        before(loginAsTeamLeader);
        after(logout);

        it('gives an error if a Team Leader try to create team', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/team`,
                form: {
                    name: `Test Team Team Leader`,
                    slug: uuid.v4(), // Create a unique slug
                    projectSlug: project.slug,
                },
            },
            (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(404);
                done();
            });
        });

        it('lets a Team Leader update team', (done) => {
            getTestTeamId(team.name)
            .then((testTeam) => {
                requestCookie.put({
                    url: `http://localhost:${config.EXPRESS_PORT}/api/v1/team/${testTeam.id}`,
                    form: {
                        team: {
                            id: testTeam.id,
                            name: testTeam.name,
                            slug: testTeam.slug,
                            projectSlug: project.slug,
                        },
                    },
                },
                (error, response, body) => {
                    expect(error).to.be.a('null');
                    expect(response.statusCode).to.equal(200);
                    expect(JSON.parse(body)).to.contain.keys('name');
                    expect(JSON.parse(body)).to.contain.keys('slug');
                    done();
                });
            });
        });

        it('gives a 403 if the Team Leader is not owner of the Team', (done) => {
            getTestTeamId(otherProjectTeam.name)
            .then((currentTeam) => {
                requestCookie.put({
                    url: `http://localhost:${config.EXPRESS_PORT}/api/v1/team/${currentTeam.id}`,
                    form: {
                        team: {
                            id: currentTeam.id,
                            name: otherProjectTeam.name,
                            slug: uuid.v4(),
                            projectSlug: otherProject.slug,
                        },
                    },
                },
                (error, response, body) => {
                    expect(error).to.be.a('null');
                    expect(response.statusCode).to.equal(403);
                    done();
                });
            });
        });
    });

    describe('as Volunteer', () => {
        before(loginAsVolunteer);
        after(deleteTestTeam);
        after(logout);

        it('gives an error if a volunteer try to create team', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/team`,
                form: {
                    name: `Test Team Volunteer`,
                    slug: uuid.v4(), // Create a unique slug
                    projectSlug: fixtures.testProject.slug,
                },
            },
            (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(404);
                done();
            });
        });
    });
});
