'use strict';
import config from '../../config';
import fixtures from '../../tests_helpers/fixtures';
import {
    deleteTestSponsor,
    requestCookie,
} from '../../tests_helpers/helpers';
import uuid from 'uuid';

// test tools
const expect = require('chai').expect;

const sponsor = {
    ...fixtures.sponsors[0],
    ...fixtures.pledges[0],
};

const team = fixtures.teams[0];

describe('Sponsor', () => {
    after(deleteTestSponsor);

    it('lets a non existing sponsor support a team', (done) => {
        requestCookie.post({
            url: `http://localhost:${config.EXPRESS_PORT}/api/v1/sponsor/team/${team.slug}`,
            form: fixtures.testSponsor,
        },
        (error, response, body) => {
            expect(error).to.be.a('null');
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(body)).to.be.an('object');
            expect(JSON.parse(body)).to.contain.keys('id');
            expect(JSON.parse(body)).to.contain.keys('firstName');
            expect(JSON.parse(body)).to.contain.keys('lastName');
            expect(JSON.parse(body)).to.contain.keys('email');
            done();
        });
    });

    it('lets an existing sponsor support a team', (done) => {
        requestCookie.post({
            url: `http://localhost:${config.EXPRESS_PORT}/api/v1/sponsor/team/${team.slug}`,
            form: sponsor,
        },
        (error, response, body) => {
            expect(error).to.be.a('null');
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(body)).to.be.an('object');
            expect(JSON.parse(body)).to.contain.keys('id');
            expect(JSON.parse(body)).to.contain.keys('firstName');
            expect(JSON.parse(body)).to.contain.keys('lastName');
            expect(JSON.parse(body)).to.contain.keys('email');
            done();
        });
    });
});
