'use strict';
import UUID from 'uuid';
import neo4jDB from 'neo4j-simple';
import config from '../config';
import util from '../helpers/util.js';
import Promise from 'bluebird';

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
            supervisorName: db.Joi.string().required(),
            approved: db.Joi.boolean().required(),
        },
    },
});

class HourRepository {
    static insert(userId, hourValues) {
        return new Promise((resolve, reject) => {
            return (new Hour(hourValues)).save()
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
                    resolve(hourValues);
                }).catch((error) => {
                    reject(null);
                });
            }).catch((hourCreateError) => {
                reject(null);
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
        .getResults('h');
    }
}

export default HourRepository;
