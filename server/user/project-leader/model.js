'use strict';
import neo4jDB from 'neo4j-simple';
import config from '../../config';
import { PROJECT_LEADER } from '../roles';

const db = neo4jDB(config.DB_URL);

import User from '../model';

class ProjectLeader {
    constructor(data, projectSlug) {
        let projectLeader;

        return new User(data, PROJECT_LEADER)
        .then((projectLeaderCreated) => {
            projectLeader = projectLeaderCreated;
            return db.query(`
                MATCH (user:PROJECT_LEADER {id: {userId} }), (project:PROJECT {slug: {projectSlug} })
                CREATE (user)-[:LEAD]->(project)
                `,
                {},
                {
                    userId: projectLeader.id,
                    projectSlug,
                }
            );
        }).then((link) => {
            return Promise.resolve(projectLeader);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
    }

    static getProject(projectLeader) {
        return db.query(`
            MATCH (project:PROJECT)<-[:LEAD]-(:PROJECT_LEADER { id: {userId} })
            RETURN project
            `,
            {},
            {
                userId: projectLeader.id,
            }
        ).getResult('project')
        .then((project) => {
            return Promise.resolve(project);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
    }
}

export default ProjectLeader;
