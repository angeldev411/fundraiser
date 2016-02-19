'use strict';
import schema from 'validate';
import stripelib from 'stripe';
import UUID from 'uuid';
import neo4jDB from 'neo4j-simple';
import config from '../config';

const db = neo4jDB(config.DB_URL);
const stripe = stripelib(config.STRIPE_TOKEN);

const pledgeSchema = schema({
    firstName: {
        type: 'string',
        message: 'A first name is required',
        match: /.{2,50}/,
    },
    lastName: {
        message: 'A last name is required',
        required: true,
    },
    paymentCardToken: {
        type: 'string',
    },
    teamShortName: {
        type: 'string',
        required: true,
    },
    email: {
        type: 'string',
        required: true,
    },
    amountPerHour: {
        required: true,
        type: 'number',
    },
    maxPerMonth: {
        message: 'Maximum per month must be a number',
        type: 'number',
    },
    volunteerUUID: {},
});

/*
A pledge is a committment to make a donation based on the hours volunteered by
one of the volunteers (or for the whole team).
*/
class Pledge {
    static create(obj) {
        return Pledge.validate(obj)
        .then(Pledge.insertIntoDb);
        // .then(Pledge.capturePayment)
        // .then(Pledge.savePaymentDetails)
    }

    static validate(obj) {
        const errs = pledgeSchema.validate(obj);

        return new Promise((resolve, reject) => {
            if (errs.length === 0) {
                resolve(obj);
            } else {
                reject(errs);
            }
        });
    }

    static insertIntoDb(obj) {
        if (!obj.uuid) {
            obj.uuid = UUID.v4();
        }

        console.log('input to Pledge.insertIntoDb', obj);

        return db.query(
            `
            MATCH (team:Team {short_name: {teamShortName} })
            MERGE (user:User {email: {email} })
            ON CREATE SET user.uuid = {uuid}, user.firstName = {firstName}, user.lastName = {lastName}

            WITH team, user

            MATCH (raisers) WHERE raisers.uuid IN [team.uuid, {volunteerUUID}]

            CREATE (pledge:Pledge {
                amountPerHour: {amountPerHour},
                maxPerMonth: {maxPerMonth}
            })
            CREATE (user)-[:PLEDGED]->(pledge)
            CREATE (raisers)-[:RAISED]->(pledge)

            RETURN  pledge
            `,
            {},
            obj
        )
        .getResults('pledge');
    }

    // TODO: bill() is the thing gonna
    static bill() {
        stripe.doStuff();
    }
}

export default Pledge;
