'use strict';
import uuid from 'uuid';
import neo4jDB from 'neo4j-simple';
import config from '../config';
import messages from '../messages';

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

        const CreatorRelationship = db.defineRelationship({
            type: 'CREATOR',
        });

        const LeadRelationship = db.defineRelationship({
            type: 'LEAD',
        });

        const project = new Node({
            id: uuid.v4(),
            name: data.project.name,
            slug: data.project.slug,
            shortDescription: data.project.shortDescription,
            projectLeaderEmail: data.project.projectLeaderEmail,
        });

        // TODO Link projectLeader
        // const projectCreator = new CreatorRelationship({}, [project.id, data.currentUser.id], db.DIRECTION.RIGHT);
        // const projectLeader = new CreatorRelationship({}, [project.id, data.projectLeader.id], db.DIRECTION.RIGHT);

        return project.save()
        // .then((response) => {
        //     console.log('NEW PROJECT', response);
        //
        //     return Promise.all([
        //         // projectCreator.save(),
        //         // projectLeader.save(),
        //     ]);
        // })
        .then((response) => {
            if (response.id === project.id) {
                return project.data;
            }
            throw new Error('Unexpected error occurred.');
        })
        .catch((err) => {
            return Promise.reject(messages.project.required);
        });
    }

    static validateUniqueSlug(project) {
        if (!project.slug) {
            return Promise.reject(messages.project.required);
        }

        return db.query(
            `MATCH (project:Project {slug: {slug} }) RETURN project`,
            {},
            project
        )
        .getResults('project')
        .then((result) => {
            if (result.length === 0) {
                return project;
            } else {
                return Promise.reject(messages.project.uniqueSlug);
            }
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
