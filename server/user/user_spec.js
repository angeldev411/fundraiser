'use strict';
import userController from './controller.js';
import messages from '../messages';
import { deleteUserInviteesByEmail } from '../tests_helpers/helpers';
import fixtures from '../tests_helpers/fixtures';

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
});
