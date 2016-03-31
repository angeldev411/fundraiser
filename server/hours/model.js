'use strict';
import UUID from 'uuid';
import neo4jDB from 'neo4j-simple';
import config from '../config';
import util from '../helpers/util.js';
import Promise from 'bluebird';
import Mailer from '../helpers/mailer';
import Mailchimp from '../helpers/mailchimp';

const db = neo4jDB(config.DB_URL);

const Hour = db.defineNode({
    label: ['HOUR'],
    schemas: {
        'default': {
            id:  db.Joi.string().required(),
            hours: db.Joi.number().required(),
            signatureData: db.Joi.string().required(),
            place : db.Joi.string().required(),
            date: db.Joi.date().required(),
            supervisorEmail: db.Joi.string().required(),
            supervisorName: db.Joi.string().required(),
            approved: db.Joi.boolean().required(),
        },
    },
});

class HourRepository {
    static insert(userId, hourValues) {
        return new Promise((resolve, reject) => {
            return (new Hour(hourValues))
            .save()
            .then((hourCreateResult) => {
                db.query(`
                    MATCH (u:VOLUNTEER {id: {userId} }), (h:HOUR {id: {id} })
                    CREATE (u)-[:VOLUNTEERED]->(h)
                `, {}, {
                    id: hourValues.id,
                    userId,
                })
                .getResults()
                .then(() => {
                    return this.isApprovalRequired(userId)
                    .then((required) => {
                        if (!required) {
                            return this.approve(hourCreateResult.id)
                            .then(() => {
                                resolve(hourValues);
                            })
                            .catch((err) => {
                                reject(err);
                            });
                        } else {
                            resolve(hourValues);
                        }
                    })
                    .catch((approvalError) => {
                        reject(approvalError);
                    });
                })
                .catch((error) => {
                    reject(error);
                });
            })
            .catch((hourCreateError) => {
                reject(hourCreateError);
            });
        });
    }

    static uploadSignature(obj) {
        const key = `signatures/${obj.id}.png`;

        return new Promise((resolve, reject) => {
            util.uploadToS3(
                obj.signatureData,
                key,
                { contentType: 'base64' },
                (err, res) => {
                    if (err) {
                        reject(`Unable to upload signature: ${err}`);
                    } else {
                        delete obj.signatureData;
                        // Signatures are not in public on S3. Should they?
                        obj.signature_url = `${config.S3.BASE_URL}/${key}`;
                        resolve(obj);
                    }
                }
            );
        });
    }

    static getHoursNotApproved(teamId) {
        return db.query(
            `MATCH (n:TEAM {id: {teamId}})<--(v:VOLUNTEER)-->(h:HOUR)
            WHERE NOT exists(h.approved) OR (h.approved = false)
            RETURN v, h`,
            {},
            { teamId }
        )
        .getResults('v', 'h')
        .then((result) => {
            const hours = [];

            for (const index in result) {
                hours.push({
                    ...(result[index].h),
                    user: {
                        ...(result[index].v),
                    },
                });
            }

            return Promise.resolve(hours);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
    }

    static approve(hourId) {
        return db.query(
            `MATCH (h:HOUR {id: {hourId}})
            SET h.approved=true
            RETURN h`,
            {},
            { hourId }
        )
        .getResult('h')
        .then((h) => {
            return this.updateHoursAttributes(hourId, h.hours);
        })
        .catch((err) => {
            Promise.reject(err);
        });
    }

    static isApprovalRequired(volunteerId) {
        return db.query(
            `MATCH (u:VOLUNTEER {id: {volunteerId}})-[:VOLUNTEER]->(t:TEAM)
            RETURN t`,
            {},
            { volunteerId }
        )
        .getResult('t')
        .then((result) => {
            if (result.hoursApprovalRequired || result.signatureRequired) {
                return Promise.resolve(true);
            } else {
                return Promise.resolve(false);
            }
        })
        .catch((err) => {
            return Promise.reject(false);
        });
    }

    static updateHoursAttributes(hourId, hours) {
        return db.query(`
            MATCH (h:HOUR {id: {hourId}})<-[:VOLUNTEERED]-(u:VOLUNTEER)-[:VOLUNTEER]->(t:TEAM)-[:CONTRIBUTE]->(p:PROJECT)
            SET     u.currentHours = u.currentHours + {hours},
                    u.totalHours = u.totalHours + {hours},
                    t.totalHours = t.totalHours + {hours}
            RETURN {volunteer: u, team: t, project: p, hour: h} AS result
            `,
            {},
            {
                hourId,
                hours: parseInt(hours, 10),
            }
        )
        .getResult('result')
        .then((result) => {
            // Check if this is the first hour ever of the volunteer
            if (result.volunteer.totalHours - parseInt(hours, 10) === 0) {
                Mailer.sendFirstHoursEmail(result.volunteer, result.team, result.project, result.hour);
            }
            // Update Mailchimp user
            return Mailchimp.updateVolunteer(result.volunteer);
        })
        .then(() => {
            return Promise.resolve();
        })
        .catch((err) => {
            return Promise.reject(err);
        });
    }
}

export default HourRepository;
