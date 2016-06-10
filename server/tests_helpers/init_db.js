'use strict';
import Promise from 'bluebird';
import config from '../config';
const db = require('neo4j-simple')(config.DB_URL);

import fixtures from './fixtures';

import Volunteer from '../user/volunteer/model';
import Sponsor from '../user/sponsor/model';
import SuperAdmin from '../user/super-admin/model';
import TeamLeader from '../user/team-leader/model';
import teamController from '../team/controller';
import ProjectLeader from '../user/project-leader/model';
import projectController from '../project/controller';
import HourRepository from '../hours/model';
import util from '../helpers/util.js';

class setup {
    static initDB() {
        return db.query(
            `CREATE CONSTRAINT ON (user:USER) ASSERT user.email IS UNIQUE;`
        )
        .then(() => (db.query(
            `CREATE CONSTRAINT ON (user:USER) ASSERT user.slug IS UNIQUE;`
        )))
        .then(() => (db.query(
            `CREATE CONSTRAINT ON (user:USER) ASSERT user.resetToken IS UNIQUE;`
        )))
        .then(() => (db.query(
            `CREATE CONSTRAINT ON (user:USER) ASSERT user.id IS UNIQUE;`
        )))
        .then(() => (db.query(
            `CREATE CONSTRAINT ON (project:PROJECT) ASSERT project.slug IS UNIQUE;`
        )))
        .then(() => (db.query(
            `CREATE CONSTRAINT ON (team:TEAM) ASSERT team.slug IS UNIQUE;`
        )))
        .then(() => (db.query(
            `CREATE CONSTRAINT ON (volunteer:VOLUNTEER) ASSERT volunteer.slug IS UNIQUE;`
        )))
        .then(() => (db.query(
            `CREATE CONSTRAINT ON (sponsor:SPONSOR) ASSERT sponsor.email IS UNIQUE;`
        )))
        .then(() => (db.query(
            `CREATE CONSTRAINT ON (sponsor:SPONSOR) ASSERT sponsor.stripeCustomerId IS UNIQUE;`
        )));
    }

    // TODO (verify all these are right after restoring / resetting db)
    static createIndexes(){
        return db.query(
            `CREATE INDEX ON :HOUR(id);`
        )
        .then(() => (db.query(
            `CREATE INDEX ON :TEAM(id);`
        )))
         .then(() => (db.query(
            `CREATE INDEX ON :TEAM_LEADER(id);`
        )))
        .then(() => (db.query(
            `CREATE INDEX ON :PROJECT(id);`
        )))
        .then(() => (db.query(
            `CREATE INDEX ON :PROJECT_LEADER(id);`
        )))
        .then(() => (db.query(
            `CREATE INDEX ON :VOLUNTEER(id);`
        )))
        .then(() => (db.query(
            `CREATE INDEX ON :SPONSOR(id);`
        )))
        ;
    }

    static addSuperAdmins() {
        const promises = fixtures.superAdmins.map((userToAdd) => {
            userToAdd.password = util.hash(userToAdd.password);
            return new SuperAdmin(userToAdd);
        });

        return Promise.all(promises)
        .then((resp) => {
            console.log('superAdmins : ok');
        })
        .catch((err) => {
            console.error('superAdmins : ', err);
        });
    }

}

console.log('Setting up Dev Db : You have 2 sec to abort!');
setTimeout(() => {
    console.log('Let\'s go!');
    Promise.resolve()
    .then(setup.initDB)
    .then(setup.createIndexes)
    .then(setup.addSuperAdmins)
    .then(() => {
        process.exit();
    })
    .catch((err) => {
        console.log(`Error in setup: ${err} stack is :`, err.stack);
        process.exit();
    });
}, 4000);
