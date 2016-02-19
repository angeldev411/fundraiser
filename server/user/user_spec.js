'use strict';
import userController from './controller.js';
import messages from '../messages';
import config from '../config';
const db = require('neo4j-simple')(config.DB_URL);

// test tools
let request = require('request');
const expect = require('chai').expect;

const matt = {
    first_name: 'matt',
    last_name: 'murphy',
    email: 'test2@aol.com',
    password: 'password',
};

const invite = 'ad@ad.com';

const invitee = {
    email: 'ad@ad.com',
    firstName: 'Adrien',
    lastName: 'Something',
    password: 'password',
};

describe('User', () => {
    describe('Invite', () => {
        after((done) => { // Log out from super admin
            return db.query(
                `
                MATCH (user:USER {email: {email}})
                DELETE user
                `,
                {},
                {
                    email: invite,
                }
            ).then((response) => {
                done();
            });
        });
        it('should create an empty user (email + inviteeCode)', (done) => {
            userController.invite(invite)
            .then((user) => {
                expect(user.email).to.equal(invite);
                expect(user).to.contain.keys('id');
                expect(user).to.contain.keys('inviteCode');
                done();
            });
        });
    });
});
