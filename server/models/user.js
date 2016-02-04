/* @flow */
import schema from 'validate';
import stripelib from 'stripe';
import sha256 from 'js-sha256';
import UUID from 'uuid';
import util from '../helpers/util';
import neo4jDB from 'neo4j-simple';
import config from '../config';

const db = neo4jDB(config.DB_URL);
const stripe = stripelib(config.STRIPE_TOKEN);

const userSchema = schema({
    first_name: {
        type: 'string',
        message: 'A first name is required',
    },
    last_name: {
        type: 'string',
        message: 'A last name is required',
    },
    email: {
        type: 'string',
        required: true,
        match: /@/,
        message: 'A Valid email must be provided',
    },
}, {
    strip: false,
});


class User {
    static validate(obj:{[email: string]: string }) {
        const errs = userSchema.validate(obj);

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

        return db.query(
            `
            MERGE (user:User {email: {email} })
            ON CREATE SET user.password = {password}, user.uuid = {uuid}, user.first_name = {first_name}, user.last_name = {last_name}
            RETURN user
            `,
            {},
            obj
        )
        .getResults('user');
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
            MATCH (user:User {uuid: {uuid} })
            CREATE (img:Image {key: {key} })

            CREATE (user)-[:HEADSHOT]->(img)

            RETURN img
            `,
            {},
            obj
        )
        .getResults('img');
    }

    static rolesForUuid(uuid) {
        if (!uuid) {
            return Promise.resolve([]); // reject('Must provide uuid')
        }
        return db.query(
            `
            MATCH (u:User {uuid: {uuid} })-[r]-(t:Team)
            RETURN type(r) as type
            UNION
            MATCH (u:User {uuid: {uuid}})-[raiserve_roles]->(company:Company {short_name: 'raiserve'})
            RETURN type(raiserve_roles) as type
            `,
            {},
            { uuid }
        )
        .getResults('type');
    }

    static volunteeringForTeams(uuid) {
        return db.query(
            `
            MATCH (u:User {uuid: {uuid}} )-[:VOLUNTEER]->(t:Team) return t
            `,
            {},
            { uuid }
        )
        .getResults('t');
    }

    static leadingTeams(uuid) {
        return db.query(
            `
            MATCH (u:User {uuid: {uuid}} )-[:LEADER]->(t:Team) return t
            `,
            {},
            { uuid }
        )
        .getResults('t');
    }

    static roleMapForUuid(uuid) {
        return db.query(
            `
            MATCH (user:User {uuid: {uuid} })
            MATCH (user)-[r:LEADER|VOLUNTEER|CREATOR|OWNER|SUPER_ADMIN]-(b) WHERE b:Team or b:Project or b:Company
            RETURN {type: head(labels(b)), uuid: b.uuid, name: b.name, short_name: b.short_name,  relation: type(r)} as role_map
            `,
            {},
            { uuid }
        )
        .getResults('role_map');
    }

    static findByUuid(uuid) {
        return db.query(
            `
            MATCH (user:User {uuid: {uuid} }) RETURN user
            `,
            {},
            { uuid }
        )
        .getResults('user');
    }

    static findByEmail(email) {
        return db.query(
            `
            MATCH (user:User {email: {email} }) RETURN user
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

export default User;