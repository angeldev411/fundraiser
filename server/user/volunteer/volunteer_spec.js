'use strict';
import config from '../../config';
import {
    loginAsSuperAdmin,
    loginAsProjectLeader,
    loginAsTeamLeader,
    loginAsVolunteer,
    logout,
    requestCookie,
} from '../../tests_helpers/helpers';

// test tools
const expect = require('chai').expect;

describe('Volunteers', () => {
    describe('as Superadmin', () => {
        before(loginAsSuperAdmin);
        after(logout);

        it('lets a super admin list all volunteers', (done) => {
            requestCookie.get({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/volunteer`,
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
                expect(JSON.parse(body)[0]).to.contain.keys('slug');
                done();
            });
        });
    });
});
