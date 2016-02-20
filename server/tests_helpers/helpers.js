import fixtures from './fixtures';
import config from '../config';
import request from 'request';
const expect = require('chai').expect;

const superAdmin = fixtures.superAdmins[0];
const teamLeader = fixtures.teamLeaders[0];
const projectLeader = fixtures.projectLeaders[0];
const volunteer = fixtures.volunteers[0];

export const loginAsSuperAdmin = (done) => {
    request.defaults({ jar: true });
    request.post({
        url: `http://localhost:${config.EXPRESS_PORT}/api/v1/auth/login`,
        form: {
            email: superAdmin.email,
            password: superAdmin.password,
        },
    }, (rerror, response) => {
        expect(response.statusCode).to.equal(200);
        done();
    });
};

export const loginAsProjectLeader = (done) => {
    request.defaults({ jar: true });
    request.post({
        url: `http://localhost:${config.EXPRESS_PORT}/api/v1/auth/login`,
        form: {
            email: projectLeader.email,
            password: projectLeader.password,
        },
    }, (rerror, response) => {
        expect(response.statusCode).to.equal(200);
        done();
    });
};

export const loginAsTeamLeader = (done) => {
    request.defaults({ jar: true });
    request.post({
        url: `http://localhost:${config.EXPRESS_PORT}/api/v1/auth/login`,
        form: {
            email: teamLeader.email,
            password: teamLeader.password,
        },
    }, (rerror, response) => {
        expect(response.statusCode).to.equal(200);
        done();
    });
};


export const loginAsVolunteer = (done) => {
    request.defaults({ jar: true });
    request.post({
        url: `http://localhost:${config.EXPRESS_PORT}/api/v1/auth/login`,
        form: {
            email: volunteer.email,
            password: volunteer.password,
        },
    }, (rerror, response) => {
        expect(response.statusCode).to.equal(200);
        done();
    });
};


export const logout = (done) => {
    request.get({
        url: `http://localhost:${config.EXPRESS_PORT}/api/v1/auth/logout`,
    }, (error, response) => {
        expect(response.statusCode).to.equal(200);
        request.defaults({ jar: false });
        done();
    });
};
