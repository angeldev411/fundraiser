'use strict';
import UUID from 'uuid';
import neo4jDB from 'neo4j-simple';
import config from '../config';
import util from '../helpers/util.js';
import Promise from 'bluebird';

const db = neo4jDB(config.DB_URL);

const Hour = db.defineNode({
    label: ['Hour'],
    schemas: {
        'default': {
            id:  db.Joi.string().required(),
            hours: db.Joi.number().required(),
            signatureData: db.Joi.string().required(),
            place : db.Joi.string().required(),
            date: db.Joi.date().required(),
            supervisorName: db.Joi.string().required(),
        },
    },
});

class Hours {
    static insert(userId, hourValues) {
        return new Promise((resolve, reject) => {
            return (new Hour(hourValues)).save()
            .then((hourCreateResult) => {
                db.query(`
                    MATCH (u:VOLUNTEER {id: {userId} }), (h:Hour {id: {id} })
                    CREATE (u)-[:OWNER]->(h)
                `, {}, {
                    id: hourValues.id,
                    userId,
                })
                .getResults()
                .then(() => {
                    console.log('Rel', hourCreateResult);
                    resolve(hourCreateResult);
                }).catch((error) => {
                    console.log('Fail Rel',error);
                    reject(null);
                });
            }).catch((hourCreateError) => {
                reject(null);
            });
        });
    }

    static uploadSignature(obj) {
        const key = `signatures/${obj.uuid}.png`;

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
}

export default Hours;
