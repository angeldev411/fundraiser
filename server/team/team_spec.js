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
    requestCookie,
} from '../tests_helpers/helpers';

// test tools
const expect = require('chai').expect;

const team = fixtures.teams[0];

describe('Team', () => {
    before(loginAsSuperAdmin);
    before(createTestProject);
    after(deleteTestProject);
    after(logout);

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

    describe('as SuperAdmin', () => {
        before(loginAsSuperAdmin);
        after(logout);

        it('lets a super admin create team', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/team`,
                form: {
                    name: `Test Team`,
                    slug: uuid.v4(), // Create a unique slug
                    projectSlug: fixtures.testProject.slug,
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

    describe('as ProjectLeader', () => {
        before(loginAsProjectLeader);
        after(logout);

        it('lets a Project leader create team', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/team`,
                form: {
                    name: 'Test Team',
                    slug: uuid.v4(), // Create a unique slug
                    projectSlug: fixtures.testProject.slug,
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

    describe('as Team Leader', () => {
        before(loginAsTeamLeader);
        after(logout);

        it('gives an error if a team leader try to create team', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/team`,
                form: {
                    name: `Test Team Team Leader`,
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

    describe('as Volunteer', () => {
        before(loginAsVolunteer);
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

    describe('GET', () => {
        it('gives a 200 if the team exists', (done) => {
            request.get({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/team/${fixtures.projects[0].slug}/${fixtures.teams[0].slug}`,
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
    });
});
