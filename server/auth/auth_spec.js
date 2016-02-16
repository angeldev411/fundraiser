'use strict';
const fixtures = require('../tests_helpers/fixtures');
const config = require('../config');
const messages = require('../messages');

// test tools
const request = require('request');
const expect = require('chai').expect;

const user = fixtures.initialUsers;

describe('Authentication', () => {
    describe('Login', () => {
        it('lets an existing user Log in', (done) => {
            request.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/auth/login`,
                form: {
                    email: user.email,
                    password: user.password,
                },
            },
            (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(200);
                expect(JSON.parse(body)).to.contain.keys('email');
                expect(JSON.parse(body)).to.contain.keys('firstName');
                expect(JSON.parse(body)).to.contain.keys('lastName');
                expect(JSON.parse(body)).to.contain.keys('uuid');
                expect(JSON.parse(body)).to.not.contain.keys('password');
                done();
            });
        });
        it('gives an error if an existing user tries to log in with a bad password', (done) => {
            request.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/auth/login`,
                form: {
                    email: user.email,
                    password: 'test',
                },
            }, (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(401);
                expect(body).to.equal(messages.login.failed);
                done();
            });
        });
        it('gives an error if a non existing user tries to log in', (done) => {
            request.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/auth/login`,
                form: {
                    email: 'test',
                    password: 'test',
                },
            }, (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(401);
                expect(body).to.equal(messages.login.failed);
                done();
            });
        });
        it('gives an error if a user tries to log in with an empty password', (done) => {
            request.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/auth/login`,
                form: {
                    email: 'test',
                    password: '',
                },
            }, (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(401);
                expect(body).to.equal(messages.login.failed);
                done();
            });
        });
        it('gives an error if a user tries to log in with an empty password', (done) => {
            request.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/auth/login`,
                form: {
                    email: '',
                    password: 'test',
                },
            }, (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(401);
                expect(body).to.equal(messages.login.failed);
                done();
            });
        });
    });
});
