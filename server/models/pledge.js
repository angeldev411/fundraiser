import schema from 'validate';
import stripelib from 'stripe';
import UUID from 'uuid';
import neo4jDB from 'neo4j-simple';
import config from '../config';

const db = neo4jDB(config.DB_URL);
const stripe = stripelib(config.STRIPE_TOKEN);

const pledgeSchema = schema({
    first_name: {
        type: 'string',
        message: 'A first name is required',
        match: /.{2,50}/,
    },
    last_name: {
        message: 'A last name is required',
        required: true,
    },
    payment_card_token: {
        type: 'string',
    },
    team_short_name: {
        type: 'string',
        required: true,
    },
    email: {
        type: 'string',
        required: true,
    },
    amount_per_hour: {
        required: true,
        type: 'number',
    },
    max_per_month: {
        message: 'Maximum per month must be a number',
        type: 'number',
    },
    volunteer_uuid: {},
});

/*
A pledge is a committment to make a donation based on the hours volunteered by
one of the volunteers (or for the whole team).
*/
class Pledge {
    static create(obj) {
        return pledge.validate(obj)
        .then(pledge.insertIntoDb);
        // .then(pledge.capturePayment)
        // .then(pledge.savePaymentDetails)
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

        console.log('input to pledge.insertIntoDb', obj);

        return db.query(
            `
            MATCH (team:Team {short_name: {team_short_name} })
            MERGE (user:User {email: {email} })
            ON CREATE SET user.uuid = {uuid}, user.first_name = {first_name}, user.last_name = {last_name}

            WITH team, user

            MATCH (raisers) WHERE raisers.uuid IN [team.uuid, {volunteer_uuid}]

            CREATE (pledge:Pledge {amount_per_hour: {amount_per_hour}, max_per_month: {max_per_month} })
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
