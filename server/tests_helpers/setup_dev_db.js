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
    // DONT DO THIS, JUST navigate to your local db directory and rm -rf data/*
    // static wipeDb() {
    //     return db.query(
    //         `MATCH (n)
    //         OPTIONAL MATCH (n)-[r]-()
    //         DELETE n,r`
    //     )
    //     .getResults('donation', 'user')
    //     .then(setup.initDB);
    // }

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

    static addProjects() {
        const promises = fixtures.projects.map((project) => {
            return projectController.store({
                project, currentUser: fixtures.superAdmins[0],
            });
        });

        Promise.all(promises)
        .then((projects) => {
            if (projects) {
                console.log('projects : ok');
                return;
            }
            console.error('projects : empty');
        })
        .catch((err) => {
            console.error('projects : ', err);
        });
    }

    static addProjectLeaders() {
        // TODO check this
        const userToAdd = fixtures.projectLeaders[0];

        userToAdd.password = util.hash(userToAdd.password);

        return new ProjectLeader(userToAdd, fixtures.projects[0].slug)
        .then((userAdded) => {
            if (userAdded) {
                console.log('projectLeader : ok');
                return;
            }
            console.error('projectLeader : empty');
        })
        .catch((err) => {
            console.error('projectLeader : ', err);
        });
    }


    static addTeams() {
        const promises = fixtures.teams.map((team, i) => {
            if (i === 0) {
                return teamController.store(
                    {
                        team,
                        currentUser: fixtures.superAdmins[0],
                    },
                    fixtures.projects[0].slug,
                );
            }
            return teamController.store(
                {
                    team,
                    currentUser: fixtures.superAdmins[0],
                },
                fixtures.projects[1].slug,
            );
        });

        Promise.all(promises)
        .then((teams) => {
            if (teams) {
                console.log('teams : ok');
                return;
            }
            console.error('teams : empty');
        })
        .catch((err) => {
            console.error('teams : ', err);
        });
    }

    static addTeamLeaders() {
        // TODO check this

        const promises = [];

        for (var i = 0; i < fixtures.teamLeaders.length; i++) {
            const userToAdd = fixtures.teamLeaders[i];

            userToAdd.password = util.hash(userToAdd.password);

            promises.push(new TeamLeader(userToAdd, fixtures.teams[i].slug))
        }

        return Promise.all(promises)
        .then((team) => {
            if (team) {
                console.log('teamLeaders : ok');
                return;
            }
            console.error('teamLeaders : empty');
        })
        .catch((err) => {
            console.error('teamLeaders :', err)
        });
    }

    static addVolunteers() {
        return Promise.resolve(fixtures.volunteers)
        .each((volunteer, i) => {
            volunteer.password = util.hash(volunteer.password);
            if (!(i % 2)) {
                return new Volunteer(volunteer, fixtures.teams[0].slug);
            } else {
                return new Volunteer(volunteer, fixtures.teams[1].slug);
            }
        }).then((user) => {
            if (user) {
                console.log('Volunteers : ok');
                return;
            }
            console.error('Volunteers : empty');
        })
        .catch((err) => {
            console.error('Volunteers :', err);
        });
    }

    static addHours() {
        return Promise.resolve(fixtures.hours)
        .each((hour, i) => {
            if (!(i % 2)) {
                return HourRepository.insert(fixtures.volunteers[0].id, fixtures.hours[i]);
            } else {
                return HourRepository.insert(fixtures.volunteers[1].id, fixtures.hours[i]);
            }
        })
        .then((user) => {
            if (user) {
                console.log('Hours : ok');
                return;
            }
            console.error('Hours : empty');
        })
        .catch((err) => {
            console.error('Hours :', err);
        });
    }

    static addSponsors() {
        return Promise.resolve(fixtures.sponsors)
        .each((sponsor, i) => {
            if (!(i % 2)) {
                return new Sponsor(sponsor, fixtures.pledges[i], fixtures.teams[0].slug);
            } else {
                return new Sponsor(sponsor, fixtures.pledges[i], null, fixtures.volunteers[0].slug);
            }
        })
        .then((sponsor) => {
            if (sponsor) {
                console.log('Sponsors : ok');
                return;
            }
            console.error('Sponsors : empty');
        })
        .catch((err) => {
            console.error('Sponsors :', err);
        });
    }
}

console.log('Setting up Dev Db : You have 2 sec to abort!');
setTimeout(() => {
    console.log('Let\'s go!');
    Promise.resolve()
    .then(setup.createIndexes)
    .then(setup.addSuperAdmins)
    .then(setup.addProjects)
    .then(setup.addTeams)
    .then(setup.addTeamLeaders)
    .then(setup.addProjectLeaders)
    .then(setup.addVolunteers)
    .then(setup.addHours)
    .then(setup.addSponsors)
    .then(() => {
        process.exit();
    })
    .catch((err) => {
        console.log(`Error in setup: ${err} stack is :`, err.stack);
        process.exit();
    });
}, 4000);
