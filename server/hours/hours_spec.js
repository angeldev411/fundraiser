import fixtures from '../tests_helpers/fixtures';
import config from '../config';
import {
    loginAsVolunteer,
    logout,
    requestCookie,
} from '../tests_helpers/helpers';

const expect = require('chai').expect;
const hour = fixtures.hours[0];

describe('Record Hours', () => {
    describe('as Volunteer', () => {
        before(loginAsVolunteer);
        after(logout);

        it('lets a volunteer record hours', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/hours`,
                form: hour,
            },
            (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(200);
                expect(JSON.parse(body)).to.be.an('object');
                expect(JSON.parse(body)).to.contain.keys('id');
                expect(JSON.parse(body)).to.contain.keys('hours');
                expect(JSON.parse(body)).to.contain.keys('place');
                expect(JSON.parse(body)).to.contain.keys('date');
                expect(JSON.parse(body)).to.contain.keys('signature_url');
                done();
            });
        });

        it('lets a volunteer list his hours', (done) => {
            requestCookie.get({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/hours`,
            },
            (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(200);
                expect(JSON.parse(body)).to.be.an('array');
                expect(JSON.parse(body)[0]).to.contain.keys('id');
                expect(JSON.parse(body)[0]).to.contain.keys('hours');
                expect(JSON.parse(body)[0]).to.contain.keys('place');
                expect(JSON.parse(body)[0]).to.contain.keys('date');
                expect(JSON.parse(body)[0]).to.contain.keys('signature_url');
                done();
            });
        });
    });
});
