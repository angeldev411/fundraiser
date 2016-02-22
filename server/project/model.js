'use strict';
import uuid from 'uuid';
import neo4jDB from 'neo4j-simple';
import config from '../config';
import messages from '../messages';
import UserController from '../user/controller';

const db = neo4jDB(config.DB_URL);

class Project {
    constructor(data) {
        const Node = db.defineNode({
            label: ['PROJECT'],
            schema: {
                id: db.Joi.string().required(),
                name: db.Joi.string().required(),
                slug: db.Joi.string().regex(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/).required(),
                shortDescription: db.Joi.string().regex(/.{50,140}/).optional(),
                projectLeaderEmail: db.Joi.string().email().optional(),
            },
        });

        const baseInfo = {
            id: uuid.v4(),
            name: data.project.name,
            slug: data.project.slug,
        };

        const optionalInfo = {};

        if (data.project.shortDescription) {
            optionalInfo.shortDescription = data.project.shortDescription;
        }
        if (data.project.projectLeaderEmail) {
            optionalInfo.projectLeaderEmail = data.project.projectLeaderEmail;
        }

        const project = new Node({
            ...baseInfo,
            ...optionalInfo,
        });

        return project.save()

        .then((response) => {
            if (response.id === project.id) {
                // Link projectCreator
                return db.query(`
                        MATCH (p:PROJECT {id: {projectId} }), (u:SUPER_ADMIN {id: {userId} })
                        CREATE (u)-[:CREATOR]->(p)
                    `,
                    {},
                    {
                        projectId: project.data.id,
                        userId: data.currentUser.id,
                    }
                ).then(() => {
                    // Link projectLeader
                    if (data.project.projectLeaderEmail) {
                        return UserController.invite(data.project.projectLeaderEmail, 'PROJECT_LEADER', data.project.slug)
                        .then(() => {
                            return Promise.resolve(project.data);
                        })
                        .catch(() => {
                            return Promise.reject(messages.invite.error);
                        });
                    }
                    return Promise.resolve(project.data);
                });
            }
            return Promise.reject('Unexpected error occurred.');
        })
        .catch((err) => {
            return Promise.reject(messages.project.required);
        });
    }

    // SECURITY: explicitly define return attributes
    static findByShortName(shortName) {
        return db.query(
            `MATCH (project:Project {shortName: {shortName} }) RETURN project`,
            {},
            { shortName }
        )
        .getResults('project');
    }

    static fetchAdminStats(projectUUID) {
        return db.query(
            `MATCH (project:Project {uuid: {projectUUID} }) RETURN project`,
            {},
            { projectUUID }
        )
        .getResult('project');
    }

    // SECURITY: explicitly define return attributes
    static findAll() {
        return db.query(
            `MATCH (project:Project) RETURN project`,
            {},
            {}
        )
        .getResults('project');
    }

    // SECURITY: explicitly define return attributes
    static findAllTeams(projectUUID) {
        return db.query(
            `MATCH (project:Project {uuid: {projectUUID} })<-[:FUNDRAISING_FOR]-(team:Team) RETURN team`,
            {},
            { projectUUID }
        )
        .getResults('team');
    }
}


export default Project;
