'use strict';
import readline from 'readline';

import config from '../config';
const db = require('neo4j-simple')(config.DB_URL);

import fixtures from './fixtures';

import User from '../user/model';
import Volunteer from '../user/volunteer/model';
import company from '../user/corporate/company';
import SuperAdmin from '../user/super-admin/model';
import Corporate from '../user/corporate/model';
import Team from '../team/model';
import TeamLeader from '../user/team-leader/model';
import TeamController from '../team/controller';
import projectLeader from '../user/project-leader/model';
import projectController from '../project/controller';
import project from '../project/model';
import donation from '../pledge/donation';
import pledge from '../pledge/model';

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

    static addCompany() {
        return company.create(fixtures.company)
        .then((resp) => {
            console.log('Company : ok');
        })
        .catch((err) => {
            console.error('Company : ', err);
        });
    }

    static assignSuperAdmins() {
        company.assignCorporate(fixtures.superAdmins[0]);
    }

    static addProjects() {
        const promises = fixtures.projects.map((project) => {
            return projectController.store({
                project, currentUser: fixtures.superAdmins[0],
            });
        });

        Promise.all(promises);
    }

    static addTeamLeaders() {
        // TODO check this
        const userToAdd = fixtures.teamLeaders[0];

        userToAdd.password = userToAdd.hashedPassword;

        return new TeamLeader(userToAdd);
    }

    static addTeams() {
        return TeamController.store({ team: fixtures.team, currentUser: fixtures.superAdmins[0] });
    }

    static addVolunteers() {
        return Promise.all(
            fixtures.volunteers.map(
                (volunteerMapped) => {
                    return new Volunteer(volunteerMapped);
                }
            )
        );
    }

    /*
    these donor data may not be complete for the needed semanatics.
    - donation is always the total amount either entered or derived from pledges
    - a donation was either raised by an individual or by a team.
    */
    static addSimpleDonations() {
        return Promise.all(
            fixtures.donors.map(
                (donor) => donation.validate(donor)
                .then(donation.insertIntoDb)
                // .then(donation.capturePayment)
                // .then(donation.savePaymentDetails)
            )
        );
    }

    static addPledges() {
        return Promise.all(
            fixtures.pledges.map(
                (p) => pledge.create(p)
            )
        );
    }

    static addLoggedService() {
        // return Promise.all(
        //     fixtures.hours.map(
        //         (hour) => volunteer.logService(hour)
        //     )
        // );
    }

    static addServiceApprovals() {
        // return Promise.all(
        //     fixtures.approvals.map(
        //         (approv) => teamLeader.approveService(approv)
        //     )
        // );
    }

    static addPaymentCaptures() {
    }
}


console.log('Setting up Dev Db');
const readingLine = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

readingLine.question(
    'Are you sure you want to wipe and regenerate the development DB? (yes/[no])',
    (answer) => {
        if (answer === 'yes') {
            console.log('Let\'s go!');
            Promise.resolve()
            .then(setup.wipeDb)
            .then(setup.createIndexes)
            .then(setup.addCompany)
            .then(setup.addSuperAdmins)
            .then(setup.addProjects)
            .then(setup.addTeams)
            .then(setup.addTeamLeaders)
            .then(setup.addVolunteers)
            .then(setup.addSimpleDonations)
            .then(setup.addPledges)
            .then(setup.addLoggedService)
            .then(setup.addServiceApprovals)
            .catch((err) => {
                console.log('Error in setup: ' + err + ' stack is ' + err.stack);
            });
        } else {
            console.log('You did not say yes, stopping.');
        }
        readingLine.close();
    }
);
