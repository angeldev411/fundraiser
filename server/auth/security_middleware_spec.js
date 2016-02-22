'use strict';
import fixtures from '../tests_helpers/fixtures';
import config from '../config';
import uuid from 'uuid';
import messages from '../messages';
import {
    loginAsSuperAdmin,
    loginAsVolunteer,
    requestCookie,
    logout,
} from '../tests_helpers/helpers';

// test tools
const expect = require('chai').expect;

describe('Security', () => {
    describe('Not Logged', () => {
        it('accessing a super-admin route gives an 404 if not logged', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/super-admin/invite`,
                form: {
                    email: `${uuid.v4()}@${uuid.v4()}.ca`,
                },
            }, (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(404);
                done();
            });
        });
        it('accessing a project-leader route gives an 404 if not logged', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/project-leader/invite`,
                form: {
                    email: `${uuid.v4()}@${uuid.v4()}.ca`,
                },
            }, (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(404);
                done();
            });
        });
        it('accessing a team-leader route gives an 404 if not logged', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/team-leader/invite`,
                form: {
                    email: `${uuid.v4()}@${uuid.v4()}.ca`,
                },
            }, (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(404);
                done();
            });
        });
        it('accessing a volunteer route gives an 404 if not logged', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/volunteer/invite`,
                form: {
                    email: `${uuid.v4()}@${uuid.v4()}.ca`,
                },
            }, (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(404);
                done();
            });
        });
    });
    describe('Logged in but wrong role', () => {
        before(loginAsVolunteer);
        after(logout);
        it('accessing a super-admin route gives an 403 if I am not a super-admin', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/super-admin/invite`,
                form: {
                    email: `${uuid.v4()}@${uuid.v4()}.ca`,
                },
            }, (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(403);
                done();
            });
        });
        it('accessing a project-leader route gives an 403 if I am a volunteer', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/project-leader/invite`,
                form: {
                    email: `${uuid.v4()}@${uuid.v4()}.ca`,
                },
            }, (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(403);
                done();
            });
        });
        it('accessing a team-leader route gives an 403 if I am a volunteer', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/team-leader/invite`,
                form: {
                    email: `${uuid.v4()}@${uuid.v4()}.ca`,
                },
            }, (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(403);
                done();
            });
        });
        it('accessing a volunteer route gives an 200 if I am a volunteer', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/volunteer/invite`,
                form: {
                    email: `${uuid.v4()}@${uuid.v4()}.ca`,
                },
            }, (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(200);
                done();
            });
        });
    });
});
