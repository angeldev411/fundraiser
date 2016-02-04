'use strict';
const schema = require('validate');
const UUID = require('uuid');
const neo4jDB = require('neo4j-simple');
const config = require('../config');

const db = neo4jDB(config.DB_URL);

const User = require('./user');
const Hours = require('./hours');

const volunteerSchema = schema({
    team_short_name: {
        type: 'string',
        required: true,
    },
    headshot_data: {
        type: 'string',
        message: 'A headshot image is required to create a volunteer',
        required: true,
    },
    bio: {
        type: 'string',
    },
    project_statement: {
        type: 'string',
    },
}, {
    strip: false,
});

class Volunteer extends User {
    /* Validates input, creates a new volunteer record
    in the database.
    Expects a team_short_name */
    static create(obj) {
        if (!obj.password) {
            obj.password = UUID.v4();
        }

        return User.assignUuid(obj)
        .then(User.validate)
        .then(volunteer.validate)
        .then(User.uploadHeadshotImage)
        .then(volunteer.insertIntoDb)
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

        return volunteer.create(obj)
        .then((newVolunteer) => db.query(`
                MATCH (team:Team {short_name: {team_short_name} })
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
            MATCH (team:Team {short_name: {team_short_name} })

            MERGE (user:User {email: {email} })
            ON CREATE SET user.password = {password}, user.uuid = {uuid}, user.first_name = {first_name}, user.last_name = {last_name}, user.bio = {bio}

            MERGE (user)-[v:VOLUNTEER]->(team)
            ON CREATE SET v.project_statement = {project_statement}

            MERGE (headshot:Image)-[:HEADSHOT]->(user)
            ON CREATE SET headshot.key = {headshot_image_key}

            RETURN user
            `,
            {},
            userSaved
        )
        .getResult('user'));
    }

    static fetchByUuid(uuid) {
        const base_url = "//s3.amazonaws.com/raiserve/";
        return db.query(
            `
            MATCH (v:User {uuid: {volunteer_uuid}})<-[:HEADSHOT]-(img:Image)
            RETURN {first_name: v.first_name, last_name: v.last_name, image_url: {base_url} + img.key, bio: v.bio} as volunteer
            `,
            {},
            {
                volunteer_uuid: uuid,
                base_url,
            }
        )
        .getResult('volunteer');
    }

    static fetchSponsors(uuid) {
        return db.query(`
            MATCH (u:User)-[:PLEDGED]->(p:Pledge)<-[:RAISED]->(volunteer:User {uuid: {uuid} }) return {first_name: u.first_name, last_name: u.last_name, email: u.email, amount: p.amount_per_hour, max_per_month: p.max_per_month} as pledges
            `,
            {},
            { uuid }
        )
        .getResults('pledges');
    }
}


module.exports = Volunteer;
