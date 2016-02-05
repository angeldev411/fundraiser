'use strict';
const schema = require('validate');
const UUID = require('uuid');
const stripelib = require('stripe');
const neo4jDB = require('neo4j-simple');
const config = require('../../config');

const db = neo4jDB(config.DB_URL);
const stripe = stripelib(config.STRIPE_TOKEN);

class ProjectLeader {
    // TODO: Service changed to Hours (arc)
    static findServiceNeedingApprovalByTeam(obj) {
        console.log(obj);

        return db.query(
            `
            MATCH (volunteer:User)-[:LOGGED]->(service:ServiceLogEntry)-[r:LOGGED_FOR_TEAM]->(team:Team)<-[:LEADER]-(leader:User {uuid: {userUUID}})
            WHERE NOT ()-[:APPROVED]->(service)
            RETURN {
                hours: service.hours,
                firstName: volunteer.firstName,
                lastName: volunteer.lastName,
                serviceUUID: service.uuid
            } as service
            `,
            {},
            obj
        )
        .getResults('service');
    }

    static fetchTeams(uuid) {
        const obj = { uuid };

        return db.query(
            `
            MATCH (user:User {uuid: {uuid} })-[:LEADER]->(team:Team)
            RETURN {
                name: team.name,
                shortName: team.shortName
            } as team
            `,
            {},
            obj
        )
        .getResults('team');
    }

    // expects obj.email and obj.inviteUUID
    static onboard(obj) {
        console.log(obj);

        return db.query(
            `
            MATCH (team:Team)-[invite:LEADER_INVITE ]->(user:User {email: {email} }) WHERE invite.uuid = {inviteUUID}

            MERGE (user)-[leadership:LEADER]->(team)
            ON CREATE SET user.firstName = {firstName}, user.lastName = {lastName}, user.password = {password}

            RETURN user
            `,
            {},
            obj
        )
        .getResult('user');
    }
}

module.exports = ProjectLeader;
