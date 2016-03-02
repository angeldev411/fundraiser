'use strict';
import neo4jDB from 'neo4j-simple';
import config from '../../config';
import { VOLUNTEER } from '../roles';
import slug from 'slug';
import util from '../../helpers/util';

const db = neo4jDB(config.DB_URL);

import User from '../model';
import Hours from '../../hours/model';

export const volunteerSchema = {
    slug: db.Joi.string(),
    headshotData: db.Joi.object(),
    description: db.Joi.string(),
    goal: db.Joi.number(),
};

export default class Volunteer {
    constructor(data, teamSlug) {
        let volunteer;

        if (data.firstName && data.lastName && !data.slug) {
            data.slug = slug(`${data.firstName.toLowerCase()}-${data.lastName.toLowerCase()}`);
        }

        return new User(data, VOLUNTEER)
        .then((volunteerCreated) => {
            volunteer = volunteerCreated;
            return db.query(`
                MATCH (user:VOLUNTEER {id: {userId} }), (team:TEAM {slug: {teamSlug} })
                CREATE (user)-[:VOLUNTEER]->(team)
                `,
                {},
                {
                    userId: volunteer.id,
                    teamSlug,
                }
            );
        })
        .then((link) => {
            return Promise.resolve(volunteer);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
    }

    /* Logs hours to the db, uploads signature */
    static logHours(obj) {
        return Hours.validate(obj)
        .then(Hours.uploadSignature)
        .then(Hours.insertIntoDb)
        .catch((err) => {
            // handle error
        });
    }

    static getTeamAndProject(volunteer) {
        return db.query(`
            MATCH (project:PROJECT)<-[:CONTRIBUTE]-(team:TEAM)<-[:VOLUNTEER]-(:VOLUNTEER { id: {userId} })
            RETURN project, team
            `,
            {},
            {
                userId: volunteer.id,
            }
        ).getResult('project', 'team')
        .then((result) => {
            return Promise.resolve(result);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
    }

    static volunteeringForTeams(uuid) {
        return db.query(
            `
            MATCH (u:USER {uuid: {uuid}} )-[:VOLUNTEER]->(t:Team) return t
            `,
            {},
            { uuid }
        )
        .getResults('t');
    }

    static getBySlug(volunteerSlug) {
        return db.query(
            `
            MATCH (user:VOLUNTEER {slug: {volunteerSlug}})
            RETURN user
            `,
            {},
            { volunteerSlug }
        )
        .getResult('user');
    }

    static getVolunteers(projectSlug = null, teamSlug = null) {
        if (!teamSlug && projectSlug) {
            return db.query(
                `
                MATCH (users:VOLUNTEER)-[:VOLUNTEER]->(:TEAM)-[:CONTRIBUTE]->(:PROJECT {slug: {projectSlug}})
                RETURN users
                `,
                {},
                { projectSlug }
            ).getResults('users');
        } else if (teamSlug) {
            return db.query(
                `
                MATCH (users:VOLUNTEER)-[:VOLUNTEER]->(:TEAM {slug: {teamSlug}})
                RETURN users
                `,
                {},
                { teamSlug }
            ).getResults('users');
        }
        return db.query(
            `
            MATCH (users:VOLUNTEER)
            RETURN users
            `
        ).getResults('users');
    }

    static updateVolunteerQueryBuilder(user) {
        const resultName = `n`
        const matchQuery = `MATCH (${resultName} { id: {id} })
`;
        let setQuery = `SET `;
        const returnQuery = `
RETURN ${resultName}
`;

        let hasSet = false;

        return new Promise((resolve, reject) => {
            if (typeof user.firstName !== 'undefined') {
                if (!util.isFirstNameValid(user.firstName)) {
                    return reject('Invalid firstname');
                }
                setQuery += `${resultName}.firstName = { firstName },`;
                hasSet = true;
            }

            if (typeof user.lastName !== 'undefined') {
                if (!util.isLastNameValid(user.lastName)) {
                    return reject('Invalid lastname');
                }
                setQuery += `${resultName}.lastName = { lastName },`;
                hasSet = true;
            }

            if (typeof user.email !== 'undefined') {
                if (!util.isEmailValid(user.email)) {
                    return reject('Invalid Email');
                }
                setQuery += `${resultName}.email = { email },`;
                hasSet = true;
            }

            if (typeof user.password !== 'undefined') {
                if (!util.isPasswordValid(user.password)) {
                    return reject('Invalid Password');
                }
                user.password = util.hash(user.password);
                setQuery += `${resultName}.password = { password },`;
                hasSet = true;
            }

            if (typeof user.slug !== 'undefined') {
                setQuery += `${resultName}.slug = { slug },`;
                hasSet = true;
            }

            if (typeof user.headshotData !== 'undefined') {
                setQuery += `${resultName}.headshotData = { headshotData },`;
                hasSet = true;
            }

            if (typeof user.goal !== 'undefined') {
                user.goal = parseInt(user.goal, 10);
                if (!util.isGoalValid(user.goal)) {
                    return reject('Invalid goal');
                }
                setQuery += `${resultName}.goal = { goal },`;
                hasSet = true;
            }

            if (typeof user.description !== 'undefined') {
                setQuery += `${resultName}.description = { description },`;
                hasSet = true;
            }

            if (!hasSet) {
                return reject('Nothing to update');
            }

            // Remove trailing comma from the set query
            setQuery = setQuery.slice(0, -1);

            return resolve(`${matchQuery}${setQuery}${returnQuery}`);
        });
    }

    static updateVolunteer(user) {
        if (typeof user.goal !== 'undefined') {
            user.goal = parseInt(user.goal, 10);
        }
        if (typeof user.password !== 'undefined') {
            user.password = util.hash(user.password);
        }
        return User.update(user, user);
    }

    static onboard(obj) {
        return Volunteer.create(obj)
        .then((newVolunteer) => db.query(`
                MATCH (team:Team {short_name: {teamShortName} })
                MATCH (user:User {email: {email} })

                MERGE (user)-[volunteerism:VOLUNTEER]->(team)
                ON CREATE SET volunteerism.goal = {goal}

                RETURN user
                `,
                {},
                newVolunteer
            )
            .getResult('user'));
    }

    static fetchSponsors(uuid) {
        return db.query(`
            MATCH (u:User)-[:PLEDGED]->(p:Pledge)<-[:RAISED]->(volunteer:User {uuid: {uuid} })
            RETURN {
                firstName: u.firstName,
                lastName: u.lastName,
                email: u.email,
                amount: p.amountPerHour,
                maxPerMonth: p.maxPerMonth
            } as pledges
            `,
            {},
            { uuid }
        )
        .getResults('pledges');
    }
}
