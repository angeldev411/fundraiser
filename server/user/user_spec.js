'use strict';
import userController from './controller.js';
import messages from '../messages';
import { deleteUserInviteesByEmail } from '../tests_helpers/helpers';
import fixtures from '../tests_helpers/fixtures';
import request from 'request';
import config from '../config';

// test tools
const expect = require('chai').expect;
let inviteCode;

describe('User', () => {
    describe('Invite', () => {
        after(deleteUserInviteesByEmail);
        it('should create an empty user (email + inviteeCode)', (done) => {
            userController.invite(fixtures.invite, null, fixtures.teams[1].slug)
            .then((user) => {
                expect(user.email).to.equal(fixtures.invite);
                inviteCode = user.inviteCode;
                expect(user).to.contain.keys('id');
                expect(user).to.contain.keys('inviteCode');
                done();
            });
        });
        it('should update an invited user in DB', (done) => {
            const user = fixtures.invitee;

            user.inviteCode = inviteCode;
            userController.signup(user)
            .then((userResponse) => {
                expect(userResponse.email).to.equal(user.email);
                expect(userResponse.firstName).to.equal(user.firstName);
                expect(userResponse).to.not.contain.keys('inviteCode');
                done();
            });
        });
        it('should add an uninvited user to the DB', (done) => {
            const user = fixtures.newUser;

            userController.signup(user, fixtures.teams[2].slug)
            .then((userResponse) => {
                expect(userResponse.email).to.equal(user.email);
                expect(userResponse.firstName).to.equal(user.firstName);
                done();
            })
            .catch((err) => {
                expect(err).to.be.undefined;
            });
        });
    });
    describe('GET', () => {
        it('gives a 200 if the volunteer exists', (done) => {
            const volunteer = fixtures.volunteers[0];

            request.get({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/user/${volunteer.firstName.toLowerCase()}-${volunteer.lastName.toLowerCase()}`,
            },
            (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(200);
                done();
            });
        });
        it('gives a 404 if the volunteer does not exist', (done) => {
            request.get({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/user/123456789123456789`,
            },
            (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(404);
                done();
            });
        });
    });
});
