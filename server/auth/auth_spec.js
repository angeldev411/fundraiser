'use strict';
const app = require('../app');
const request = require('supertest');
const fixtures = require('../tests_helpers/fixtures');

const user = fixtures.initialUsers;

describe('Authentication', () => {
    describe('Login', (done) => {
        it('lets an existing user Log in', () => {
            request(app)
            .post('/api/v1/login', {
                email: user.email,
                password: user.password,
            })
            .expect(200, done);
        });
    });
});
