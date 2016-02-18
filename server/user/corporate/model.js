'use strict';
import schema from 'validate';
import neo4jDB from 'neo4j-simple';
import config from '../../config';

const db = neo4jDB(config.DB_URL);

import Team from '../../team/model';
import Project from '../../project/model';

import User from '../model';

class Corporate {
    constructor(data) {
        return new User(data, 'Corporate')
        .then((corporate) => {
            console.log(corporate);
            // create relationShip
            return corporate;
        });
    }

    static findProjects(uuid) {

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

export default Corporate;
