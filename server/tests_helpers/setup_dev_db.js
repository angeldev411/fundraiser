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

class setup {
    static wipeDb() {
        return db.query(
            `MATCH (n)
            OPTIONAL MATCH (n)-[r]-()
            DELETE n,r`
        )
        .getResults('donation', 'user')
        .then(setup.initDB);
    }

    static initDB() {
        return db.query(
            `CREATE CONSTRAINT ON (user:USER) ASSERT user.email IS UNIQUE`
        )
        .then(() => (db.query(
            `CREATE CONSTRAINT ON (user:USER) ASSERT user.slug IS UNIQUE`
        )))
        .then(() => (db.query(
            `CREATE CONSTRAINT ON (project:PROJECT) ASSERT project.slug IS UNIQUE`
        )))
        .then(() => (db.query(
            `CREATE CONSTRAINT ON (team:TEAM) ASSERT team.slug IS UNIQUE`
        )));
    }

    static createIndexes() {
        return db.query(
            `
            CREATE INDEX ON :Hour(id)
            `
        )
        .getResults('donation', 'user')
        .then(() => {
            return db.query(
                `
                CREATE INDEX ON :User(id)
                `
            )
            .getResults('donation', 'user');
        });
    }

    static addSuperAdmins() {
        const promises = fixtures.superAdmins.map((userToAdd) => {
            userToAdd.password = userToAdd.hashedPassword;
            delete userToAdd.hashedPassword;
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

        userToAdd.password = userToAdd.hashedPassword;
        delete userToAdd.hashedPassword;

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
        const userToAdd = fixtures.teamLeaders[0];

        userToAdd.password = userToAdd.hashedPassword;
        delete userToAdd.hashedPassword;

        return new TeamLeader(userToAdd, fixtures.teams[0].slug)
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
            volunteer.password = volunteer.hashedPassword;
            delete volunteer.hashedPassword;
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
    .then(setup.wipeDb)
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
