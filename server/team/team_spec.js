'use strict';
const fixtures = require('../tests_helpers/fixtures');
const config = require('../config');
const messages = require('../messages');
const uuid = require('uuid');


// test tools
let request = require('request');
const expect = require('chai').expect;

const superAdmin = fixtures.superAdmins[0];
const teamLeader = fixtures.teamLeaders[0];

const team = fixtures.team;
let Cookies = null;

describe('Team', () => {

    it('gives an error if the team slug already exists in the database', (done) => {
        request.post({
            url: `http://localhost:${config.EXPRESS_PORT}/api/v1/team`,
            form: {
                name: team.name,
                slug: team.slug,
            },
        }, (error, response, body) => {
            expect(error).to.be.a('null');
            expect(response.statusCode).to.equal(400);
            expect(body).to.equal(messages.team.uniqueSlug);
            done();
        });
    });

    it('gives an error if a super admin tries to create team with an empty name', (done) => {
        request.post({
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
        request.post({
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
        request.post({
            url: `http://localhost:${config.EXPRESS_PORT}/api/v1/team`,
            form: {
                name: 'test',
                slug: 'test',
                teamLeaderEmail: 'test',
            },
        }, (error, response, body) => {
            expect(error).to.be.a('null');
            expect(response.statusCode).to.equal(400);
            expect(body).to.equal(messages.team.required);
            done();
        });
    });

    describe('SuperAdmin', () => {
        before( (done) => { // Log in as superadmin
            request = request.defaults({ jar: true });
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
        });

        after( (done) => { // Log out from super admin
            request.get({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/auth/logout`,
            }, (error, response) => {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });

        it('lets a super admin create team', (done) => {
            request.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/team`,
                form: {
                    name: team.name,
                    slug: uuid.v4(), // Create a unique slug
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

    describe('ProjectLeader', () => {
        before( (done) => { // Log in as superadmin
            request = request.defaults({ jar: true });
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
        });

        after( (done) => { // Log out from super admin
            request.get({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/auth/logout`,
            }, (error, response) => {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });

        it('lets a super admin create team', (done) => {
            request.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/team`,
                form: {
                    name: team.name,
                    slug: uuid.v4(), // Create a unique slug
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

    // describe('Non SuperAdmin', () => {
    //     it('gives an error if an non super admin try to create team', (done) => {
    //         request.post({
    //             url: `http://localhost:${config.EXPRESS_PORT}/api/v1/team`,
    //             form: {
    //                 email: user.email,
    //                 password: 'test',
    //             },
    //         }, (error, response, body) => {
    //             expect(error).to.be.a('null');
    //             expect(response.statusCode).to.equal(401);
    //             expect(body).to.equal(messages.login.failed);
    //             done();
    //         });
    //     });
    // });
});
