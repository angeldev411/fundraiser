'use strict';
import neo4jDB from 'neo4j-simple';
import config from '../../config';
import { TEAM_LEADER } from '../roles';
import Promise from 'bluebird';

const db = neo4jDB(config.DB_URL);

import User from '../model';

class TeamLeader {
    constructor(data, teamSlug) {
        let teamLeader;

        return new User(data, TEAM_LEADER)
        .then((teamLeaderCreated) => {
            teamLeader = teamLeaderCreated;
            return db.query(`
                MATCH (user:TEAM_LEADER {id: {userId} }), (team:TEAM {slug: {teamSlug} })
                CREATE (user)-[:LEAD]->(team)
                `,
                {},
                {
                    userId: teamLeader.id,
                    teamSlug,
                }
            );
        })
        .then((link) => {
            return Promise.resolve(teamLeader);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
    }

    static getTeamAndProject(teamLeader) {
        return db.query(`
            MATCH (project:PROJECT)<-[:CONTRIBUTE]-(team:TEAM)<-[:LEAD]-(:TEAM_LEADER { id: {userId} })
            RETURN project, team
            `,
            {},
            {
                userId: teamLeader.id,
            }
        ).getResult('project', 'team')
        .then((result) => {
            return Promise.resolve(result);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
    }

    static ownsTeam(userId, teamId) {
        return TeamLeader.getTeamAndProject({
            id: userId,
        }).then((result) => {
            if (result.team.id === teamId) {
                return true;
            }
            return false;
        }).catch((error) => {
            return false;
        });
    }

    static approveHours(hoursID) {
        return leader
        .approveHours(hoursID);
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

    // TODO
    static findAllHoursNeedingApproval(obj) {
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

export default TeamLeader;
