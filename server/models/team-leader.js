import schema from 'validate';
import UUID from 'uuid';
import neo4jDB from 'neo4j-simple';
import config from '../config';

const db = neo4jDB(config.DB_URL);
const stripe = stripelib(config.STRIPE_TOKEN);

class TeamLeader {
    static approveHours(hoursID) {
        return leader
        .approveHours(hoursID);
    }

    // TODO: Service changed to Hours (arc)
    static findServiceNeedingApprovalByTeam(obj) {
        console.log(obj);

        return db.query(
            `
            MATCH (volunteer:User)-[:LOGGED]->(service:ServiceLogEntry)-[r:LOGGED_FOR_TEAM]->(team:Team)<-[:LEADER]-(leader:User {uuid: {user_uuid}})
            WHERE NOT ()-[:APPROVED]->(service)
            RETURN {hours: service.hours, first_name: volunteer.first_name, last_name: volunteer.last_name, service_uuid: service.uuid}as service
            `,
            {},
            obj
        )
        .getResults('service');
    }

    // TODO
    static findAllHoursNeedingApproval(obj) {
        console.log(obj);

        return db.query(
            // `
            // MATCH (volunteer:User)-[:LOGGED]->(service:ServiceLogEntry)-[r:LOGGED_FOR_TEAM]->(team:Team)<-[:LEADER]-(leader:User {uuid: {user_uuid}})
            // WHERE NOT ()-[:APPROVED]->(service)
            // RETURN {hours: service.hours, first_name: volunteer.first_name, last_name: volunteer.last_name, service_uuid: service.uuid}as service
            // `,
            // {},
            // obj
        )
        .getResults('service');
    }


    static fetchTeams(uuid) {
        const obj = { uuid };

        return db.query(
            `
            MATCH (user:User {uuid: {uuid} })-[:LEADER]->(team:Team) RETURN {name: team.name, short_name: team.short_name} as team
            `,
            {},
            obj
        )
        .getResults('team');
    }

    // expects obj.email and obj.invite_uuid
    static onboard(obj) {
        console.log(obj);

        return db.query(
            `
            MATCH (team:Team)-[invite:LEADER_INVITE ]->(user:User {email: {email} }) WHERE invite.uuid = {invite_uuid}

            MERGE (user)-[leadership:LEADER]->(team)
            ON CREATE SET user.first_name = {first_name}, user.last_name = {last_name}, user.password = {password}

            RETURN user
            `,
            {},
            obj
        )
        .getResult('user');
    }
}

export default TeamLeader;
