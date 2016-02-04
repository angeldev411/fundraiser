const schema = require('validate');
const neo4jDB = require('neo4j-simple');
const config = require('../config');

const db = neo4jDB(config.DB_URL);

const Team = require('./team');

// TODO: corporate_schema ?

class Corporate {
    static findProjects(uuid) {

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
            MATCH (project:Project)<-[pt:FUNDRAISING_FOR]-(team:Team {short_name: {teamShortName} })-[:LOGO]->(img:Image), (project)-[:SPLASH_IMAGE]-(pimg:Image)
            RETURN {
                name: team.name,
                uuid: team.uuid,
                short_name: team.short_name,
                short_description: COALESCE(pt.short_description, project.short_description),
                long_description: COALESCE(pt.long_description, project.long_description),
                splash_image_url: {base_url} + pimg.key,
                logo_url: {base_url} + img.key
            } as team
            `,
            {},
            {
                teamShortName,
                base_url: config.S3_BASE_URL,
            }
        )
        .getResult('team');
    }
}

module.exports = Corporate;
