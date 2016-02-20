'use strict';
import stripelib from 'stripe';
import sha256 from 'js-sha256';
import UUID from 'uuid';
import util from '../helpers/util';
import neo4jDB from 'neo4j-simple';
import config from '../config';
import Promise from 'bluebird';

const db = neo4jDB(config.DB_URL);
const stripe = stripelib(config.STRIPE_TOKEN);

const defaultSchema = {
    id: db.Joi.string().required(),
    email: db.Joi.string().email().required(),
    password: db.Joi.string().required(),
};

import { volunteerSchema } from './volunteer/model';

const userSchemas = {
    'default': defaultSchema,
    invitee: {
        ...defaultSchema,
        inviteCode: db.Joi.string().required(),
    },
    volunteer: {
        ...defaultSchema,
        ...volunteerSchema,
    },
};

export default class User {
    constructor(data, label) {
        if (!data.id) {
            data.id = UUID.v4();
        }
        if (!data.password) {
            data.inviteCode = UUID.v4();
            data.password = '';
        }
        const labels = ['USER'];

        if (label) {
            labels.push(label);
        }

        const Node = db.defineNode({
            label: labels,
            schemas: userSchemas,
        });

        const user = new Node(data);

        return Promise.resolve(user.save())
        .then((results) => {
            return results;
        })
        .catch((err) => {
            console.error('Couldnt save user ', err);
            return Promise.reject(err);
        });
    }

    static uploadHeadshotImage(obj) {
        console.log('upload headshot image GOT UUID ' + obj.uuid);
        return new Promise((resolve, reject) => {
            const contentType = util.detectContentType(obj.headshotData);

            try {
                const hash = sha256(obj.headshotData);

                obj.headshotImageKey = `${config.USER_IMAGES_FOLDER}/${hash}.jpg`;
                console.log(`uploading hs image with key ${obj.headshotImageKey}`);

                util.uploadToS3(
                    obj.headshotData,
                    'raiserve',
                    obj.headshotImageKey,
                    { contentType },
                    (err, data) => {
                        if (err) {
                            reject(`error uploading headshot data ${err}`);
                        } else {
                            delete obj.headshotData;
                            resolve(obj);
                        }
                    }
                );
            } catch (e) {
                reject(`upload error: ${e} ${e.stack}`);
            }
        });
    }

    /* expects obj.uuid and obj.key */
    static addHeadshotImageToDb(obj) {
        return db.query(
            `
            MATCH (user:USER {uuid: {uuid} })
            CREATE (img:Image {key: {key} })

            CREATE (user)-[:HEADSHOT]->(img)

            RETURN img
            `,
            {},
            obj
        )
        .getResults('img');
    }

    static rolesForUser(id) {
        if (!id) {
            return Promise.reject('You must provide an id');
        }
        return db.query(
            `
            MATCH (u:USER {id: {id} })
            RETURN labels(u) as roles
            `,
            {},
            { id }
        )
        .getResults('roles');
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

    static leadingTeams(uuid) {
        return db.query(
            `
            MATCH (u:USER {uuid: {uuid}} )-[:LEADER]->(t:Team) return t
            `,
            {},
            { uuid }
        )
        .getResults('t');
    }

    static getById(id) {
        return db.query(
            `
            MATCH (user:USER {id: {id} }) RETURN user
            `,
            {},
            { id }
        )
        .getResults('user');
    }

    static getByEmail(email) {
        return db.query(
            `
            MATCH (user:USER {email: {email} }) RETURN user
            `,
            {},
            { email }
        )
        .getResults('user');
    }

    /* Stripe related stuff */
    static createCardProfile(obj) {
        return new Promise((resolve, reject) => {
            stripe.customers.createCard(
                obj.stripeCustomerID,
                { card: obj.cardToken },
                (err, card) => {
                    if (err) {
                        reject(err);
                    } else {
                        obj.card = card;
                        resolve(obj);
                    }
                }
            );
        });
    }

    static createCustomerProfile(obj) {
        return new Promise((resolve, reject) => {
            stripe.customers.create(
                { email: obj.email },
                (err, customer) => {
                    if (err) {
                        reject(err);
                    } else {
                        obj.stripeCustomerID = customer.id;
                        resolve(obj);
                    }
                }
            );
        });
    }
}
