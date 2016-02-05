'use strict';
const schema = require('validate');
const neo4jDB = require('neo4j-simple');
const config = require('../../config');

const db = neo4jDB(config.DB_URL);

const Team = require('../../team/model');
const Project = require('../../project/model');

// TODO: corporate_schema ?

class Corporate {
    static findProjects(uuid) {

    }

    static createProject(project) {
        Project.validate(project)
        .then(Project.create)
        .catch((err) => {
            console.error(err);
        });
    }

    static createTeam(team) {
        Team.validate(team)
        .then(Team.create)
        .catch((err) => {
            console.error(err);
        });
    }

    static inviteUser(obj) {
        switch (obj.role) {
            case 'VOLUNTEER':
                return Team.inviteVolunteer(obj);
            case 'LEADER':
                return Team.inviteLeader(obj);
            case 'SUPPORTER':
                return Team.inviteSupporter(obj);
            default:
                return Promise.reject('no role provided to inviteUser');
        }
    }

    static fetchTeamStats(teamShortName) {
        return db.query(
            `
            MATCH (project:Project)<-[pt:FUNDRAISING_FOR]-(team:Team {shortName: {teamShortName} })-[:LOGO]->(img:Image), (project)-[:SPLASH_IMAGE]-(pimg:Image)
            RETURN {
                name: team.name,
                uuid: team.uuid,
                shortName: team.shortName,
                shortDescription: COALESCE(pt.shortDescription, project.shortDescription),
                longDescription: COALESCE(pt.longDescription, project.longDescription),
                splashImageURL: {baseURL} + pimg.key,
                logo_url: {baseURL} + img.key
            } as team
            `,
            {},
            {
                teamShortName,
                baseURL: config.S3_BASE_URL,
            }
        )
        .getResult('team');
    }
}

module.exports = Corporate;
