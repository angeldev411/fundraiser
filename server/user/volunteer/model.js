'use strict';
import neo4jDB from 'neo4j-simple';
import config from '../../config';
import { VOLUNTEER } from '../roles';
import slug from 'slug';

const db = neo4jDB(config.DB_URL);

import User from '../model';
import Hours from '../../hours/model';

export const volunteerSchema = {
    slug: db.Joi.string(),
    headshotData: db.Joi.object(),
    description: db.Joi.string(),
};

export default class Volunteer {
    constructor(data, teamSlug) {
        let volunteer;

        if (data.firstName && data.lastName) {
            data.slug = slug(`${data.firstName.toLowerCase()}_${data.lastName.toLowerCase()}`);
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
