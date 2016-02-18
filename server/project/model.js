'use strict';
const schema = require('validate');
const uuid = require('uuid');
const neo4jDB = require('neo4j-simple');
const config = require('../config');

const db = neo4jDB(config.DB_URL);

class Project {

    static validateUniqueSlug(project) {
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
                return Promise.reject('Duplicate Project slug)');
            }
        });
    }

    /* deprecated REALLY? */
    static create(data) {
        const Node = db.defineNode({
            label: ['Project'],
            schema: {
                id: db.Joi.string().required(),
                name: db.Joi.string().required(),
                slug: db.Joi.string().regex(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/).required(),
                shortDescription: db.Joi.string().regex(/.{50,140}/).required(),
                teamLeaderEmail: db.Joi.string().email().optional(),
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
            teamLeaderEmail: data.project.teamLeaderEmail,
        });

        // const projectCreator = new CreatorRelationship({}, [project.id, data.currentUser.id], db.DIRECTION.RIGHT);
        // const projectLeader = new CreatorRelationship({}, [project.id, data.teamLeader.id], db.DIRECTION.RIGHT);

        Promise.all([
            project.save(),
        ]).then(function (response) {
            console.log('NEW PROJECT', response);
            // projectCreator.save();
            // projectLeader.save();

            // Send welcome email to project leader?
        })
        .catch((err) => {
            console.error(err);
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


module.exports = Project;
