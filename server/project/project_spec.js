'use strict';
import fixtures from '../tests_helpers/fixtures';
import config from '../config';
import messages from '../messages';
import uuid from 'uuid';
import request from 'request';
import {
    loginAsSuperAdmin,
    logout,
    requestCookie,
} from '../tests_helpers/helpers';

// test tools
const expect = require('chai').expect;

const project = fixtures.projects[0];

describe('Project', () => {
    describe('SuperAdmin', () => {
        before(loginAsSuperAdmin);
        after(logout);

        it('lets a super admin create project', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/project`,
                form: {
                    name: 'Test Project',
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

        it('gives an error if the project slug already exists in the database', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/project`,
                form: {
                    name: project.name,
                    slug: project.slug,
                },
            }, (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(400);
                expect(body).to.equal(messages.project.required);
                done();
            });
        });

        it('gives an error if a super admin tries to create project with an empty name', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/project`,
                form: {
                    name: '',
                    slug: 'test',
                },
            }, (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(400);
                expect(body).to.equal(messages.project.required);
                done();
            });
        });
        it('gives an error if a super admin tries to create project with an empty slug', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/project`,
                form: {
                    name: 'test',
                    slug: '',
                },
            }, (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(400);
                expect(body).to.equal(messages.project.required);
                done();
            });
        });
        it('gives an error if a super admin tries to create project with an malformed email', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/project`,
                form: {
                    name: 'test',
                    slug: 'test',
                    projectLeaderEmail: 'test',
                },
            }, (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(400);
                expect(body).to.equal(messages.notEmail);
                done();
            });
        });
    });

    // describe('Non SuperAdmin', () => {
    //     it('gives an error if an non super admin try to create project', (done) => {
    //         requestCookie.post({
    //             url: `http://localhost:${config.EXPRESS_PORT}/api/v1/project`,
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
