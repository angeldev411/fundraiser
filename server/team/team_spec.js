'use strict';
import fixtures from '../tests_helpers/fixtures';
import config from '../config';
import messages from '../messages';
import uuid from 'uuid';
import request from 'request';
import {
    loginAsSuperAdmin,
    loginAsProjectLeader,
    logout,
} from '../tests_helpers/helpers';

// test tools
const expect = require('chai').expect;

const team = fixtures.team;

describe('Team', () => {
    before(loginAsSuperAdmin);
    after(logout);

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
            expect(body).to.equal(messages.team.required);
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
        before(loginAsSuperAdmin);
        after(logout);

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
        before(loginAsProjectLeader);
        after(logout);

        it('lets a Project leader create team', (done) => {
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
