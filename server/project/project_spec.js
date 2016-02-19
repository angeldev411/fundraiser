'use strict';
import fixtures from '../tests_helpers/fixtures';
import config from '../config';
import messages from '../messages';
import uuid from 'uuid';


// test tools
let request = require('request');
const expect = require('chai').expect;

const superAdmin = fixtures.superAdmins[0];
const project = fixtures.projects[0];
let Cookies = null;

describe('Project', () => {
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

        it('lets a super admin create project', (done) => {
            request.post({
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
            request.post({
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
            request.post({
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
            request.post({
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
            request.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/project`,
                form: {
                    name: 'test',
                    slug: 'test',
                    projectLeaderEmail: 'test',
                },
            }, (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(400);
                expect(body).to.equal(messages.project.required);
                done();
            });
        });
    });

    // describe('Non SuperAdmin', () => {
    //     it('gives an error if an non super admin try to create project', (done) => {
    //         request.post({
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
