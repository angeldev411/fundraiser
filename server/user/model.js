'use strict';

import stripelib from 'stripe';
import sha256 from 'js-sha256';
import UUID from 'uuid';
import util from '../helpers/util';
import neo4jDB from 'neo4j-simple';
import config from '../config';
import Promise from 'bluebird';

import * as roles from './roles';


const db = neo4jDB(config.DB_URL);
const stripe = stripelib(config.STRIPE_TOKEN);

const defaultSchema = {
    id: db.Joi.string().required(),
    firstName: db.Joi.string().optional(),
    lastName: db.Joi.string().optional(),
    email: db.Joi.string().email().regex(/^(([a-zA-Z]|[0-9])|([-]|[_]|[.]))+[@](([a-zA-Z0-9])|([-])){2,63}[.](([a-zA-Z0-9]){2,63})+$/).required(),
    password: db.Joi.string().regex(/^.+$/).required(),
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
    // id should never be passed, except for the update
    constructor(data, label, id) {
        if (!data.id) {
            data.id = UUID.v4();
        }

        if (!data.password) {
            if (label !== roles.SPONSOR) { // Sponsors don't have invite code
                data.inviteCode = UUID.v4();
            }
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

        const user = new Node(data, id);

        return user.save()
        .then((idObject) => {
            return User.getByID(idObject.id);
        })
        .then((userBrandNew) => {
            return Promise.resolve(userBrandNew);
        })
        .catch((err) => {
            // console.error('[USER] Couldnt save user ', err);
            return Promise.reject(err);
        });
    }

    static update(userNode, data) {
        let role = null;
        data.inviteCode = null;

        if (userNode.roles && userNode.roles[1]) {
            role = userNode.roles[1]
        }
        return new User(data, role, userNode.id);
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

    static hoursForUser(id) {
        if (!id) {
            return Promise.reject('You must provide an id');
        }
        return db.query(
            `
            MATCH (u:USER {id: {id} })-[r:VOLUNTEERED]->(c)
            RETURN c as hours
            ORDER BY c.date
            `,
            {},
            { id }
        )
        .getResults('hours');
    }

    static getByID(id) {
        return db.query(
            `
            MATCH (user:USER {id: {id} }) RETURN user
            `,
            {},
            { id }
        )
        .getResult('user');
    }

    static getByEmail(email) {
        return db.query(
            `
            MATCH (user:USER {email: {email} }) RETURN user
            `,
            {},
            { email }
        )
        .getResult('user');
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
