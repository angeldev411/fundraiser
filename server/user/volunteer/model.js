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
    headshotData: db.Joi.string(),
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

    static getTopVolunteers(projectSlug = null, teamSlug = null) {
        return db.query(
            `
            MATCH (users:VOLUNTEER)-[:VOLUNTEER]->(:TEAM {slug: {teamSlug}})-[:CONTRIBUTE]->(:PROJECT {slug: {projectSlug}})
            WHERE exists(users.raised)
            RETURN users
            ORDER BY users.raised DESC
            LIMIT 5
            `,
            {},
            {
                projectSlug,
                teamSlug,
            }
        ).getResults('users');
    }

    static updateVolunteer(user) {
        if (typeof user.email !== 'undefined') {
            if (!util.isEmailValid(user.email)) {
                return Promise.reject('Invalid email');
            }
        }

        if (typeof user.goal !== 'undefined') {
            user.goal = parseInt(user.goal, 10);
            if (isNaN(user.goal) || user.goal < 0 || user.goal > 999) {
                return Promise.reject('Invalid goal');
            }
        }
        if (typeof user.password !== 'undefined') {
            if (user.password !== '') {
                user.password = util.hash(user.password);
            } else {
                Reflect.deleteProperty(user, 'password');
            }
        }
        if (typeof user.roles !== 'undefined') {
            Reflect.deleteProperty(user, 'roles');
        }

        return new Promise((resolve, reject) => {
            const callUserUpdate = (uploadUrl) => {
                return User.update(user, {
                    ...(user.id ? { id: user.id } : {}),
                    ...(user.firstName ? { firstName: user.firstName } : {}),
                    ...(user.lastName ? { lastName: user.lastName } : {}),
                    ...(user.email ? { email: user.email } : {}),
                    ...(user.goal ? { goal: user.goal } : {}),
                    ...(user.password ? { password: user.password } : {}),
                    ...(user.roles ? { roles: user.roles } : {}),
                    ...(user.description ? { description: user.description } : {}),
                    ...(uploadUrl ? { headshotData: uploadUrl } : {}),
                    ...(user.slug ? { slug: user.slug } : {}),
                    ...(user.totalHours ? { totalHours: user.totalHours } : {}),
                    ...(user.currentHours ? { currentHours: user.currentHours } : {}),
                }).then((data) => {
                    return resolve(data);
                }).catch((error) => {
                    return reject(error);
                });
            };

            if (typeof user.headshotData !== 'undefined') {
                return Volunteer.uploadHeadshot({
                    id: user.id,
                    headshotData: user.headshotData,
                }).then((uploadUrl) => {
                    return callUserUpdate(uploadUrl);
                }).catch((error) => {
                    return reject(error);
                });
            }
            return callUserUpdate();
        });
    }

    static uploadHeadshot(obj) {
        const key = `users/${obj.id}.png`;

        return new Promise((resolve, reject) => {
            util.uploadToS3(
                obj.headshotData,
                key,
                { contentType: 'base64' },
                (err, res) => {
                    if (err) {
                        reject(`Unable to upload signature: ${err}`);
                    } else {
                        resolve(`${config.S3.BASE_URL}/${key}`);
                    }
                }
            );
        });
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
