'use strict';
import neo4jDB from 'neo4j-simple';
import config from '../../config';
import Promise from 'bluebird';
import { VOLUNTEER } from '../roles';
import slug from 'slug';
import util from '../../helpers/util';
import Mailer from '../../helpers/mailer';
import Mailchimp from '../../helpers/mailchimp';
import TeamLeader from '../team-leader/model';
const db = neo4jDB(config.DB_URL);

import User from '../model';
import Hours from '../../hours/model';

export const volunteerSchema = {
    slug: db.Joi.string(),
    image: db.Joi.string(),
    description: db.Joi.string(),
    goal: db.Joi.number(),
};

export default class Volunteer {
    constructor(data, teamSlug) {
        // Set default attributes to 0
        data.hourlyPledge = 0;
        data.totalSponsors = 0;
        data.currentHours = 0;
        data.totalHours = 0;
        data.raised = 0;

        if (data.firstName && data.lastName && !data.slug) {
            return Volunteer.createSlug(data.firstName, data.lastName)
            .then((userSlug) => {
                data.slug = userSlug;
                return Volunteer.saveVolunteer(data, teamSlug)
                .then((volunteer) => {
                    return Promise.resolve(volunteer);
                })
                .catch((err) => {
                    return Promise.reject(err);
                });
            });
        } else {
            return Volunteer.saveVolunteer(data, teamSlug)
            .then((volunteer) => {
                return Promise.resolve(volunteer);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
        }
    }

    static saveVolunteer(data, teamSlug) {
        let volunteer;

        return new User(data, VOLUNTEER)
        .then((volunteerCreated) => {
            volunteer = volunteerCreated;
            // Create relation and increment team volunteers number
            return db.query(`
                MATCH (user:VOLUNTEER {id: {userId} }), (team:TEAM {slug: {teamSlug} })
                SET team.totalVolunteers = team.totalVolunteers + 1
                CREATE (user)-[:VOLUNTEER]->(team)
                RETURN {user: user, team: team} AS result
                `,
                {},
                {
                    userId: volunteer.id,
                    teamSlug,
                }
            ).getResult('result');
        })
        .then((result) => {
            // Get team teamLeader
            return TeamLeader.getTeamLeader(result.team.id)
            .then((teamLeader) => {
                // Update teamLeader
                return Mailchimp.updateTeamLeader(teamLeader);
            })
            .catch((err) => {
                // There is no team leader
                Promise.resolve();
            });
        })
        .then(() => {
            // Get welcome email data
            return Volunteer.getTeamAndProject(volunteer);
        })
        .then((result) => {
            Mailer.sendVolunteerWelcomeEmail(result.project, result.team, volunteer);
            // Add user to mailchimp
            return Mailchimp.subscribeVolunteer(volunteer);
        })
        .then(() => {
            return Promise.resolve(volunteer);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
    }

    static createSlug(firstName, lastName, suffix = null) {
        let userSlug;

        if (suffix) {
            userSlug = slug(`${firstName.toLowerCase()}-${lastName.toLowerCase()}-${suffix}`);
        } else {
            suffix = 1;
            userSlug = slug(`${firstName.toLowerCase()}-${lastName.toLowerCase()}`);
        }

        return this.verifySlug(userSlug)
        .then((result) => { // Slug is already taken
            return this.createSlug(firstName, lastName, suffix + 1);
        })
        .catch((err) => {
            return Promise.resolve(userSlug);
        });
    }

    static verifySlug(userSlug) {
        return db.query(`
            MATCH (user {slug: {userSlug} })
            WHERE user:USER OR user:USER_DISABLED
            RETURN user
            `,
            {},
            {
                userSlug,
            }
        ).getResult('user');
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

    static getLastVolunteerDate(volunteer) {
        return db.query(`
            MATCH (hour:HOUR)<-[:VOLUNTEERED]-(:VOLUNTEER { id: {userId} })
            RETURN hour
            ORDER BY hour.date DESC
            LIMIT 1
            `,
            {},
            {
                userId: volunteer.id,
            }
        ).getResult('hour')
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
                ORDER BY users.totalHours DESC
                `,
                {},
                { projectSlug }
            ).getResults('users');
        } else if (teamSlug) {
            return db.query(
                `
                MATCH (users:VOLUNTEER)-[:VOLUNTEER]->(:TEAM {slug: {teamSlug}})
                RETURN users
                ORDER BY users.totalHours DESC
                `,
                {},
                { teamSlug }
            ).getResults('users');
        }
        return db.query(
            `
            MATCH (users:VOLUNTEER)
            RETURN users
            ORDER BY users.totalHours DESC
            `
        ).getResults('users');
    }

    static getVolunteersByIds(projectSlug = null, teamSlug = null, volunteersIds = null) {
        if (!teamSlug && projectSlug) {
            return db.query(
                `
                MATCH (users:VOLUNTEER)-[:VOLUNTEER]->(:TEAM)-[:CONTRIBUTE]->(:PROJECT {slug: {projectSlug}})
                WHERE users.id IN {volunteersIds}
                RETURN users
                `,
                {},
                {
                    projectSlug,
                    volunteersIds,
                }
            ).getResults('users');
        } else if (teamSlug) {
            return db.query(
                `
                MATCH (users:VOLUNTEER)-[:VOLUNTEER]->(:TEAM {slug: {teamSlug}})
                WHERE users.id IN {volunteersIds}
                RETURN users
                `,
                {},
                {
                    teamSlug,
                    volunteersIds,
                }
            ).getResults('users');
        }
        return db.query(
            `
            MATCH (users:VOLUNTEER)
            WHERE users.id IN {volunteersIds}
            RETURN users
            `,
            {},
            {
                volunteersIds,
            }
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

    static updateVolunteer(currentUser, user) {
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

        if (typeof user.roles !== 'undefined') {
            Reflect.deleteProperty(user, 'roles');
        }

        return new Promise((resolve, reject) => {
            const callUserUpdate = (uploadUrl) => {
                return User.update(currentUser, {
                    ...(user.id ? { id: currentUser.id } : {}),
                    ...(user.firstName ? { firstName: user.firstName } : {}),
                    ...(user.lastName ? { lastName: user.lastName } : {}),
                    ...(user.email ? { email: user.email } : {}),
                    ...(user.goal ? { goal: user.goal } : {}),
                    ...(user.password ? { password: user.password } : {}),
                    ...(user.roles ? { roles: currentUser.roles } : {}),
                    ...(user.description ? { description: user.description } : {}),
                    ...(uploadUrl ? { image: uploadUrl } : {}),
                    ...(user.slug ? { slug: currentUser.slug } : {}),
                    ...(user.totalHours ? { totalHours: user.totalHours } : {}),
                    ...(user.currentHours ? { currentHours: user.currentHours } : {}),
                }).then((data) => {
                    return resolve(data);
                }).catch((error) => {
                    return reject(error);
                });
            };

            if (user.image.indexOf('?') >= 0) {
                user.image = user.image.substring(0, user.image.indexOf('?'));
            }

            if (typeof user.image !== 'undefined' && currentUser.image !== user.image) {
                return Volunteer.uploadHeadshot({
                    id: user.id,
                    image: user.image,
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
                obj.image,
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

    static unlinkVolunteers(volunteers, adminID) {
        return Promise.resolve(volunteers)
        .each((volunteer, i) => {
            return db.query(
                `
                MATCH (user:VOLUNTEER {id: {volunteerId}})-[:VOLUNTEER]->(team:TEAM)<-[*]-(admin:USER {id: {adminID}})
                SET user:VOLUNTEER_DISABLED:USER_DISABLED, team.totalVolunteers = team.totalVolunteers - 1
                REMOVE user:VOLUNTEER:USER
                RETURN user
                `,
                {},
                {
                    volunteerId: volunteer.id,
                    adminID,
                }
            );
        })
        .then(() => {
            return Promise.resolve();
        })
        .catch((err) => {
            return Promise.reject(err);
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

    static resetCurrentHours() {
        return db.query(`
            MATCH (volunteer:VOLUNTEER)
            SET volunteer.currentHours = 0
            RETURN volunteer as volunteers
            `,
        )
        .getResults('volunteers')
        .then(() => {
            console.log('Volunteers current hours successfully reseted!');
        })
        .catch((err) => {
            console.log('Reset current hours failed:', err);
        })
    }
}
