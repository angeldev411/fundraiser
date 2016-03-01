'use strict';
import config from '../../config';
import fixtures from '../../tests_helpers/fixtures';
import {
    loginAsSuperAdmin,
    loginAsProjectLeader,
    loginAsTeamLeader,
    loginAsVolunteer,
    logout,
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

const team = fixtures.teams[1];
const volunteer = fixtures.volunteers[1];
const project1Volunteer = fixtures.volunteers[0];
const project2Volunteer = fixtures.volunteers[1];

describe('Sponsor', () => {
    after(deleteTestSponsor);

    describe('Support Team', () => {
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

    describe('Support Volunteer', () => {
        it('lets a non existing sponsor support a volunteer', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/sponsor/volunteer/${volunteer.slug}`,
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

        it('lets an existing sponsor support a volunteer', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/sponsor/volunteer/${volunteer.slug}`,
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

    describe('as Superadmin', () => {
        before(loginAsSuperAdmin);
        after(logout);

        it('lets a super admin list all sponsors', (done) => {
            requestCookie.get({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/sponsor`,
            },
            (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(200);
                expect(JSON.parse(body)).to.be.an('array');
                expect(JSON.parse(body)[0]).to.contain.keys('id');
                expect(JSON.parse(body)[0]).to.contain.keys('firstName');
                expect(JSON.parse(body)[0]).to.contain.keys('lastName');
                expect(JSON.parse(body)[0]).to.contain.keys('email');
                expect(JSON.parse(body)[0]).to.not.contain.keys('password');
                expect(JSON.parse(body)[0]).to.not.contain.keys('slug');
                expect(JSON.parse(body)[0].pledges[0].support).to.contain.keys('total');
                expect(JSON.parse(body)[0].pledges[0].support).to.contain.keys('cap');
                expect(JSON.parse(body)[0].pledges[0].support).to.contain.keys('date');
                expect(JSON.parse(body)[0].pledges[0].support).to.contain.keys('hourly');
                expect(body).to.contain(project1Volunteer.email);
                expect(body).to.contain(fixtures.testSponsor.email);
                done();
            });
        });
    });

    describe('as Project Leader', () => {
        before(loginAsProjectLeader);
        after(logout);

        it('lets a project leader list project sponsors', (done) => {
            requestCookie.get({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/sponsor`,
            },
            (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(200);
                expect(JSON.parse(body)).to.be.an('array');
                expect(JSON.parse(body)[0]).to.contain.keys('id');
                expect(JSON.parse(body)[0]).to.contain.keys('firstName');
                expect(JSON.parse(body)[0]).to.contain.keys('lastName');
                expect(JSON.parse(body)[0]).to.contain.keys('email');
                expect(JSON.parse(body)[0]).to.not.contain.keys('password');
                expect(JSON.parse(body)[0]).to.not.contain.keys('slug');
                expect(JSON.parse(body)[0].pledges[0].support).to.contain.keys('total');
                expect(JSON.parse(body)[0].pledges[0].support).to.contain.keys('cap');
                expect(JSON.parse(body)[0].pledges[0].support).to.contain.keys('date');
                expect(JSON.parse(body)[0].pledges[0].support).to.contain.keys('hourly');
                expect(body).to.contain(project1Volunteer.email);
                expect(body).to.not.contain(fixtures.testSponsor.email);
                done();
            });
        });
    });

    describe('as Team Leader', () => {
        before(loginAsTeamLeader);
        after(logout);

        it('lets a team leader list team sponsors', (done) => {
            requestCookie.get({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/sponsor`,
            },
            (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(200);
                expect(JSON.parse(body)).to.be.an('array');
                expect(JSON.parse(body)[0]).to.contain.keys('id');
                expect(JSON.parse(body)[0]).to.contain.keys('firstName');
                expect(JSON.parse(body)[0]).to.contain.keys('lastName');
                expect(JSON.parse(body)[0]).to.contain.keys('email');
                expect(JSON.parse(body)[0]).to.not.contain.keys('password');
                expect(JSON.parse(body)[0]).to.not.contain.keys('slug');
                expect(JSON.parse(body)[0].pledges[0].support).to.contain.keys('total');
                expect(JSON.parse(body)[0].pledges[0].support).to.contain.keys('cap');
                expect(JSON.parse(body)[0].pledges[0].support).to.contain.keys('date');
                expect(JSON.parse(body)[0].pledges[0].support).to.contain.keys('hourly');
                expect(body).to.contain(project1Volunteer.email);
                expect(body).to.not.contain(fixtures.testSponsor.email);
                done();
            });
        });
    });

    describe('as Volunteer', () => {
        before(loginAsVolunteer);
        after(logout);

        it('lets a volunteer list his sponsors', (done) => {
            requestCookie.get({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/sponsor`,
            },
            (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(200);
                expect(JSON.parse(body)).to.be.an('array');
                expect(JSON.parse(body)[0]).to.contain.keys('id');
                expect(JSON.parse(body)[0]).to.contain.keys('firstName');
                expect(JSON.parse(body)[0]).to.contain.keys('lastName');
                expect(JSON.parse(body)[0]).to.contain.keys('email');
                expect(JSON.parse(body)[0]).to.not.contain.keys('password');
                expect(JSON.parse(body)[0]).to.not.contain.keys('slug');
                expect(JSON.parse(body)[0].pledges[0].support).to.contain.keys('total');
                expect(JSON.parse(body)[0].pledges[0].support).to.contain.keys('cap');
                expect(JSON.parse(body)[0].pledges[0].support).to.contain.keys('date');
                expect(JSON.parse(body)[0].pledges[0].support).to.contain.keys('hourly');
                expect(body).to.contain(project1Volunteer.email);
                expect(body).to.not.contain(fixtures.testSponsor.email);
                done();
            });
        });
    });
});
