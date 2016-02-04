'use strict';
const readline = require('readline');

const config = require('../config');
const db = require('neo4j-simple')(config.DB_UreadingLine);


const user = require('../user/model');
const company = require('../user/corporate/company');
const corporate = require('../user/corporate/model');
const team = require('../team/model');
const teamLeader = require('../user/team-leader/model');
const projectLeader = require('../user/project-leader/model');
const volunteer = require('../user/volunteer/model');
const project = require('../project/model');
const donation = require('../pledge/donation');
const pledge = require('../pledge/model');
const util = require('../helpers/util');
const fixtures = require('./fixtures');
const mocks = require('./mocks');

const readingLine = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

class setup {
    static wipeDb() {
        return db.query(
            `MATCH (n)
            OPTIONAL MATCH (n)-[r]-()
            DELETE n,r`
        )
        .getResults('donation', 'user');
    }

    static addInitialUsers() {
        const u = fixtures.initialUsers;

        return user.validate(u)
        .then(user.insertIntoDb);
    }

    static addCompany() {
        const raiserve = fixtures.company;

        return company.create(raiserve)
        .then((resp) => {
            console.log('company returned');
            console.log(resp);
        });
    }

    static assignSuperAdmins() {
        company.assignSuperAdmin(fixtures.superAdmin);
    }

    static addProjects() {
        return Promise.all([
            corporate.createProject(fixtures.projects[0]),
            corporate.createProject(fixtures.projects[1]),
        ]);
    }

    static addTeams() {
        return corporate.createTeam(fixtures.team);
    }

    static addVolunteers() {
        return Promise.all(
            fixtures.volunteers.map(
                (volunteerMapped) => volunteer.create(volunteerMapped)
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
        return Promise.all(
            fixtures.hours.map(
                (hour) => volunteer.logService(hour)
            )
        );
    }

    static addServiceApprovals() {
        return Promise.all(
            fixtures.approvals.map(
                (approv) => leader.approveService(approv)
            )
        );
    }

    static addPaymentCaptures() {
    }
}


console.log('Seting up Dev Db');

readingLine.question(
    'Are you sure you want to wipe and regenerate the development DB? (yes/[no])',
    (answer) => {
        if (answer === 'yes') {
            console.log('Let\'s go!');
            Promise.resolve()
            .then(setup.wipeDb)
            .then(setup.addCompany)
            .then(setup.addInitialUsers)
            .then(setup.assignSuperAdmins)
            .then(setup.addProjects)
            .then(setup.addTeams)
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
