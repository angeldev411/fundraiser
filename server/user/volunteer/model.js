'use strict';
const schema = require('validate');
const UUID = require('uuid');
const neo4jDB = require('neo4j-simple');
const config = require('../../config');

const db = neo4jDB(config.DB_URL);

const User = require('../model');
const Hours = require('../../hours/model');

const volunteerSchema = schema({
    teamShortName: {
        type: 'string',
        required: true,
    },
    headshotData: {
        type: 'string',
        message: 'A headshot image is required to create a volunteer',
        required: true,
    },
    bio: {
        type: 'string',
    },
    projectStatement: {
        type: 'string',
    },
}, {
    strip: false,
});

class Volunteer extends User {
    /* Validates input, creates a new volunteer record
    in the database.
    Expects a teamShortName */
    static create(obj) {
        if (!obj.password) {
            obj.password = UUID.v4();
        }
        if (!obj.uuid) {
            obj.uuid = UUID.v4();
        }

        return User.validate(obj)
        .then(Volunteer.validate)
        .then(User.uploadHeadshotImage)
        .then(Volunteer.insertIntoDb)
        .catch((err) => {
            // handle error
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

    static validate(obj) {
        const errs = volunteerSchema.validate(obj);

        if (errs.length === 0) {
            return Promise.resolve(obj);
        } else {
            return Promise.reject(errs);
        }
    }

    static onboard(obj) {
        console.log(obj);

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

    static insertIntoDb(obj) {
        console.log("insert vol started " + obj.email);

        return super.insertIntoDb(obj)
        .then((userSaved) => db.query(
            `
            MATCH (team:Team {short_name: {teamShortName} })

            MERGE (user:User {email: {email} })
            ON CREATE SET user.password = {password}, user.uuid = {uuid}, user.firstName = {firstName}, user.lastName = {lastName}, user.bio = {bio}

            MERGE (user)-[v:VOLUNTEER]->(team)
            ON CREATE SET v.projectStatement = {projectStatement}

            MERGE (headshot:Image)-[:HEADSHOT]->(user)
            ON CREATE SET headshot.key = {headshotImageKey}

            RETURN user
            `,
            {},
            userSaved
        )
        .getResult('user'));
    }

    static fetchByUuid(uuid) {
        return db.query(
            `
            MATCH (v:User {uuid: {volunteer_uuid}})<-[:HEADSHOT]-(img:Image)
            RETURN {
                firstName: v.firstName,
                lastName: v.lastName,
                imageURL: {baseURL} + img.key, bio: v.bio
            } as volunteer
            `,
            {},
            {
                volunteer_uuid: uuid,
                baseURL: config.S3_BASE_URL,
            }
        )
        .getResult('volunteer');
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


module.exports = Volunteer;
