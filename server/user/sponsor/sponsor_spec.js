'use strict';
import config from '../../config';
import fixtures from '../../tests_helpers/fixtures';
import {
    requestCookie,
} from '../../tests_helpers/helpers';

// test tools
const expect = require('chai').expect;

const sponsor = fixtures.sponsors[0];
const team = fixtures.teams[0];

describe('Sponsor', () => {
    it('lets a user support a team', (done) => {
        requestCookie.post({
            url: `http://localhost:${config.EXPRESS_PORT}/api/v1/sponsor/team/${team.slug}`,
            form: sponsor,
        },
        (error, response, body) => {
            console.log(error);
            console.log(response);
            console.log(body);
            expect(error).to.be.a('null');
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(body)).to.be.an('object');
            // expect(JSON.parse(body)[0]).to.contain.keys('id');
            // expect(JSON.parse(body)[0]).to.contain.keys('firstName');
            // expect(JSON.parse(body)[0]).to.contain.keys('lastName');
            // expect(JSON.parse(body)[0]).to.contain.keys('email');
            // expect(JSON.parse(body)[0]).to.not.contain.keys('password');
            // expect(JSON.parse(body)[0]).to.contain.keys('slug');
            // expect(body).to.contain(project1Volunteer.email);
            // expect(body).to.contain(project2Volunteer.email);
            done();
        });
    });
});
