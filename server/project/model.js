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

        const project = new Node({
            id: uuid.v4(),
            name: data.project.name,
            slug: data.project.slug,
            shortDescription: data.project.shortDescription,
            projectLeaderEmail: data.project.projectLeaderEmail,
        });

        // console.log(data.currentUser.id);

        return project.save()

        .then((response) => {
            if (response.id === project.id) {
                console.log('NEW PROJECT', project.data);

                // Link projectCreator
                db.query(`
                        MATCH (p:PROJECT {id: {projectId} }), (u:SUPER_ADMIN {id: {userId} })
                        CREATE (u)-[:CREATOR]->(p)
                    `,
                    {},
                    {
                        projectId: project.data.id,
                        userId: data.currentUser.id
                    }
                ).then(() => {
                    // Link projectLeader
                    console.log('project-leader', data.project.projectLeaderEmail);

                    if (true) { // TODO If projectLeaderEmail is defined in form
                        UserController.invite(data.project.projectLeaderEmail, 'PROJECT_LEADER', data.project.slug)

                        .then(() => {
                            return Promise.resolve(project.data)
                        })
                    }
                })
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
