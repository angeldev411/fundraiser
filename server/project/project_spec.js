'use strict';
import fixtures from '../tests_helpers/fixtures';
import config from '../config';
import messages from '../messages';
import uuid from 'uuid';
import {
    loginAsSuperAdmin,
    loginAsProjectLeader,
    loginAsTeamLeader,
    loginAsVolunteer,
    getTestProjectId,
    deleteTestProject,
    logout,
    requestCookie,
} from '../tests_helpers/helpers';

// test tools
const expect = require('chai').expect;

const testProject = fixtures.testProject;
const existingProject = fixtures.projects[0];

describe('Project', () => {
    after(deleteTestProject);

    describe('as SuperAdmin', () => {
        before(loginAsSuperAdmin);
        after(logout);

        it('lets a super admin list all projects', (done) => {
            requestCookie.get({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/project`,
            },
            (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(200);
                expect(JSON.parse(body)).to.be.an('array');
                expect(JSON.parse(body)[0]).to.contain.keys('id');
                expect(JSON.parse(body)[0]).to.contain.keys('name');
                expect(JSON.parse(body)[0]).to.contain.keys('slug');
                expect(body).to.contain(existingProject.name);
                done();
            });
        });

        it('lets a super admin create project', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/project`,
                form: testProject,
            },
            (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(200);
                expect(JSON.parse(body)).to.contain.keys('name');
                expect(JSON.parse(body)).to.contain.keys('slug');
                done();
            });
        });

        it('gives an error if the project slug already exists in the database', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/project`,
                form: {
                    name: existingProject.name,
                    slug: existingProject.slug,
                },
            }, (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(400);
                expect(body).to.equal(messages.project.required);
                done();
            });
        });

        it('gives an error if a super admin tries to create project with an empty name', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/project`,
                form: {
                    name: '',
                    slug: 'test',
                },
            }, (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(400);
                expect(body).to.equal(messages.project.required);
                done();
            });
        });

        it('gives an error if a super admin tries to create project with an empty slug', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/project`,
                form: {
                    name: 'test',
                    slug: '',
                },
            }, (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(400);
                expect(body).to.equal(messages.project.required);
                done();
            });
        });

        it('gives an error if a super admin tries to create project with an malformed email', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/project`,
                form: {
                    name: 'test',
                    slug: 'test',
                    projectLeaderEmail: 'test',
                },
            }, (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(400);
                expect(body).to.equal(messages.notEmail);
                done();
            });
        });

        it('lets a super admin update project', (done) => {
            getTestProjectId(testProject.name)
            .then((project) => {
                requestCookie.put({
                    url: `http://localhost:${config.EXPRESS_PORT}/api/v1/project/${project.id}`,
                    form: {
                        name: testProject.name,
                        slug: uuid.v4(),
                    },
                },
                (error, response, body) => {
                    expect(error).to.be.a('null');
                    expect(response.statusCode).to.equal(200);
                    expect(JSON.parse(body)).to.contain.keys('name');
                    expect(JSON.parse(body)).to.contain.keys('slug');
                    done();
                });
            });
        });
    });

    describe('as Project Leader', () => {
        before(loginAsProjectLeader);
        after(logout);

        it('gives an error if a project leader try to create project', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/project`,
                form: {
                    name: 'Test Project Project Leader',
                    slug: uuid.v4(), // Create a unique slug
                },
            }, (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(404);
                done();
            });
        });

        it('gives an error if a project leader try to update project', (done) => {
            getTestProjectId(testProject.name)
            .then((project) => {
                console.log(project);
                requestCookie.put({
                    url: `http://localhost:${config.EXPRESS_PORT}/api/v1/project/${project.id}`,
                    form: {
                        name: testProject.name,
                        slug: uuid.v4(),
                    },
                },
                (error, response, body) => {
                    console.log(arguments);
                    expect(error).to.be.a('null');
                    expect(response.statusCode).to.equal(404);
                    done();
                });
            })
            .catch((err) => {
                console.log(err);
            });
        });

        it('gives an error if a project leader try to list projects', (done) => {
            requestCookie.get({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/project`,
            }, (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(404);
                done();
            });
        });
    });

    describe('as Team Leader', () => {
        before(loginAsTeamLeader);
        after(logout);

        it('gives an error if a team leader try to create project', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/project`,
                form: {
                    name: 'Test Project Team Leader',
                    slug: uuid.v4(), // Create a unique slug
                },
            }, (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(404);
                done();
            });
        });

        it('gives an error if a team leader try to update project', (done) => {
            getTestProjectId(testProject.name)
            .then((project) => {
                requestCookie.put({
                    url: `http://localhost:${config.EXPRESS_PORT}/api/v1/project/${project.id}`,
                    form: {
                        name: testProject.name,
                        slug: uuid.v4(),
                    },
                },
                (error, response, body) => {
                    expect(error).to.be.a('null');
                    expect(response.statusCode).to.equal(404);
                    done();
                });
            });
        });

        it('gives an error if a team leader try to list projects', (done) => {
            requestCookie.get({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/project`,
            }, (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(404);
                done();
            });
        });
    });

    describe('as Volunteer', () => {
        before(loginAsVolunteer);
        after(logout);

        it('gives an error if a volunteer try to create project', (done) => {
            requestCookie.post({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/project`,
                form: {
                    name: 'Test Project Volunteer',
                    slug: uuid.v4(), // Create a unique slug
                },
            }, (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(404);
                done();
            });
        });

        it('gives an error if a volunteer try to update project', (done) => {
            getTestProjectId(testProject.name)
            .then((project) => {
                requestCookie.put({
                    url: `http://localhost:${config.EXPRESS_PORT}/api/v1/project/${project.id}`,
                    form: {
                        name: testProject.name,
                        slug: uuid.v4(),
                    },
                },
                (error, response, body) => {
                    expect(error).to.be.a('null');
                    expect(response.statusCode).to.equal(404);
                    done();
                });
            });
        });

        it('gives an error if a volunteer try to list projects', (done) => {
            requestCookie.get({
                url: `http://localhost:${config.EXPRESS_PORT}/api/v1/project`,
            }, (error, response, body) => {
                expect(error).to.be.a('null');
                expect(response.statusCode).to.equal(404);
                done();
            });
        });
    });
});
