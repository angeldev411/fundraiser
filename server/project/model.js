'use strict';
const schema = require('validate');
const uuid = require('uuid');
const neo4jDB = require('neo4j-simple');
const config = require('../config');

const db = neo4jDB(config.DB_URL);

// const projectSchema = schema({
//     uuid: {
//         type: 'string',
//         message: 'Project UUID is required',
//         required: true,
//     },
//     name: {
//         type: 'string',
//         message: 'A Project name is required',
//         required: true,
//     },
//     slug: {
//         type: 'string',
//         message: 'A Project slug is required',
//         match: (/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/),
//         required: true,
//     },
//     shortDescription: {
//         type: 'string',
//         message: 'A Project short description must be 50-140 chars',
//         match: (/.{50,140}/),
//         required: true,
//     },
//     teamLeaderEmail: {
//         type: 'string',
//         message: 'Please verify email address',
//         match: (/^(([a-zA-Z]|[0-9])|([-]|[_]|[.]))+[@](([a-zA-Z0-9])|([-])){2,63}[.](([a-zA-Z0-9]){2,63})+$/gi),
//     },
// });

class Project {

    // static validate(project) {
    //     const schemaErrs = projectSchema.validate(project);
    //
    //     if (schemaErrs.length === 0) {
    //         return this.validateUniqueSlug(project)
    //             .then((uniqueProject) => (Promise.resolve(uniqueProject)))
    //             .catch((errs) => (Promise.reject(errs)));
    //     } else {
    //         return Promise.reject(schemaErrs);
    //     }
    // }

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
    static create(project, currentUser, leader) {
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

        const newProject = new Node({
            id: uuid.v4(),
            name: project.name,
            slug: project.slug,
            shortDescription: project.shortDescription,
            teamLeaderEmail: project.teamLeaderEmail,
        });

        Promise.all([
            newProject.save(),
        ]).then(function (response) {
            console.log('NEW PROJECT', response);
            // Send welcome email to project leader?
        })
        .catch((err) => {
            console.error(err);
        });

        // MATCH (creator:User {uuid: {currentUser.uuid}})
        // MATCH (leader:User {uuid: {leader.uuid}})
        // CREATE (creator)-[:CREATOR]->(project)
        // CREATE (leader)-[:LEAD]->(project)
        // return db.query(
        //     `
        //     CREATE (project:Project
        //         {
        //             uuid: { project.uuid },
        //             name: { project.name },
        //             slug: { project.slug },
        //             shortDescription: { project.shortDescription }
        //         }
        //     )
        //
        //     RETURN project
        //     `,
        //     {},
        //     { project, currentUser, leader }
        // )
        // .getResults('project')
        // .then((result) => {
        //     // Send welcome email to project leader?
        //
        //     // we put the image url back in
        //     result[0].splashImageData = obj.splashImageData;
        //     return Promise.resolve(result[0]);
        // });
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
