'use strict';
import neo4jDB from 'neo4j-simple';
import config from '../../config';
import { TEAM_LEADER } from '../roles';
import Promise from 'bluebird';
import Mailchimp from '../../helpers/mailchimp';

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
        .then(() => {
            // Add user to mailchimp
            return Mailchimp.subscribeTeamLeader(teamLeader);
        })
        .then(() => {
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

    static getTeamLeader(teamId) {
        return db.query(`
            MATCH (:TEAM { id: {teamId} })<-[:LEAD]-(teamLeader:TEAM_LEADER)
            RETURN teamLeader
            `,
            {},
            {
                teamId,
            }
        ).getResult('teamLeader')
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

    static indirectlyOwnsHour(userId, hourId) {
        return TeamLeader.getHour(
            userId,
            hourId
        ).then((result) => {
            return true;
        }).catch((error) => {
            return false;
        });
    }

    static getHour(id, hourId) {
        return db.query(`
            MATCH (h:HOUR { id: {hourId} })<-[:VOLUNTEERED]-(v:VOLUNTEER)-[:VOLUNTEER]->(t:TEAM)<-[:LEAD]-(:TEAM_LEADER { id: {userId} })
            RETURN h
            `,
            {},
            {
                userId: id,
                hourId,
            }
        ).getResult('h')
        .then((result) => {
            if (result.id === hourId) {
                return Promise.resolve(result);
            }
            return Promise.reject(err);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
    }

    static approveHours(hoursID) {
        return leader
        .approveHours(hoursID);
    }

    static getTeamRelatedUser(userEmail, teamSlug) {
        return db.query(
            `
            MATCH (user:USER {email: {userEmail} })
            RETURN user
            `,
            {},
            {
                userEmail,
                teamSlug,
            }
        )
        .getResult('user');
    }
}

export default TeamLeader;
