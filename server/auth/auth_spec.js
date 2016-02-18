'use strict';
import fixtures from '../tests_helpers/fixtures';
import config from '../config';
import messages from '../messages';

// test tools
let request = require('request');
const expect = require('chai').expect;

const user = fixtures.superAdmins[0];
let Cookies = null;

describe('Authentication', () => {
    describe('Login', () => {
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
        it('gives an error if a user tries to log in with an empty email', (done) => {
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
        it('lets an existing user Log in', (done) => {
            request = request.defaults({ jar: true });
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
                expect(JSON.parse(body)).to.contain.keys('roles');
                expect(JSON.parse(body).roles).to.contain('SUPER_ADMIN');
                if (response.headers['set-cookie']) {
                    Cookies = response.headers['set-cookie'].pop().split(';')[0];
                }
                done();
            });
        });
    });
    describe('Who am I', () => {
        it('tells me who I am when I am logged in', (done) => {
            request.get({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/auth/whoami`,
                headers: {
                    cookies: Cookies,
                },
            }, (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(200);
                expect(JSON.parse(body)).to.contain.keys('email');
                expect(JSON.parse(body)).to.contain.keys('firstName');
                expect(JSON.parse(body)).to.contain.keys('lastName');
                expect(JSON.parse(body)).to.contain.keys('uuid');
                expect(JSON.parse(body)).to.not.contain.keys('password');
                expect(JSON.parse(body)).to.contain.keys('roles');
                expect(JSON.parse(body).roles).to.contain('SUPER_ADMIN');
                request = request.defaults({ jar: false });
                done();
            });
        });
    });
    describe('Logout', () => {
        it('always accept the logout', (done) => {
            request.get({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/auth/logout`,
            }, (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(200);
                expect(body).to.equal(messages.logout);
                done();
            });
        });
    });
    describe('Who am I', () => {
        it('tells me I am not connected when I am logged out', (done) => {
            request.get({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/auth/whoami`,
            }, (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(404);
                done();
            });
        });
    });
});
