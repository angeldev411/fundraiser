'use strict';
import uuid from 'uuid';
import neo4jDB from 'neo4j-simple';
import config from '../config';
import messages from '../messages';
import UserController from '../user/controller';
import utils from '../helpers/util';

const db = neo4jDB(config.DB_URL);

class Project {
    constructor(data, id) {
        const Node = db.defineNode({
            label: ['PROJECT'],
            schema: {
                id: db.Joi.string().required(),
                name: db.Joi.string().required(),
                slug: db.Joi.string().regex(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/).required(),
                shortDescription: db.Joi.string().regex(/.{50,140}/).optional(),
            },
        });

        if (data.project.projectLeaderEmail && !utils.isEmailValid(data.project.projectLeaderEmail)) {
            return Promise.reject(messages.notEmail);
        }

        const fakeLeaderId = uuid.v4();

        const baseInfo = {
            id: data.project.id || uuid.v4(),
            name: data.project.name,
            slug: data.project.slug.toLowerCase(),
            fakeLeaderId,
        };

        const optionalInfo = {};

        if (data.project.shortDescription) {
            optionalInfo.shortDescription = data.project.shortDescription;
        }

        const project = new Node({
            ...baseInfo,
            ...optionalInfo,
        }, id);

        return project.save()
        .then((response) => {
            if (id && !data.project.projectLeaderEmail) {
                // If it's an update, don't relink project creator and return project immediately
                return Promise.resolve(project.data);
            } else if (id && data.project.projectLeaderEmail) {
                // If it's an update, but new project leader email is defined
                return UserController.invite(data.project.projectLeaderEmail, 'PROJECT_LEADER', data.project.slug)
                .then(() => {
                    return Promise.resolve(project.data);
                })
                .catch(() => {
                    return Promise.reject(messages.invite.error);
                });
            } else if (!id && response.id === project.id) {
                // If it's a new project, link projectCreator
                return db.query(`
                        MATCH (p:PROJECT {id: {projectId} }), (u:SUPER_ADMIN {id: {userId} })
                        CREATE (u)-[:CREATOR]->(p)
                    `,
                    {},
                    {
                        projectId: project.data.id,
                        userId: data.currentUser.id,
                    }
                )
                .then(() => {
                    // create fake project Leader
                    return Project.createFakeLeader(project.data.id, fakeLeaderId);
                })
                .then(() => {
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

    static createFakeLeader(projectId, projectLeaderId) {
        return db.query(`
                CREATE (u:USER:PROJECT_LEADER:FAKE_LEADER {id: {projectLeaderId}, firstName: 'Project Leader'})
                RETURN u
            `,
            {},
            {
                projectLeaderId,
            }
        ).getResult('u')
        .then((projectLeader) => {
            // console.log(projectLeader);
            return db.query(`
                    MATCH (p:PROJECT {id: {projectId} }), (u:PROJECT_LEADER {id: {projectLeaderId} })
                    CREATE (u)-[:LEAD]->(p)
                `,
                {},
                {
                    projectId,
                    projectLeaderId: projectLeader.id,
                }
            );
        })
        .then(() => {
            return Promise.resolve();
        })
        .catch((err) => {
            console.log(err);
            return Promise.reject(err);
        });
    }

    static getProjects() {
        return db.query(`
            MATCH (p:PROJECT)
            OPTIONAL MATCH (p)<--(t:TEAM)
            RETURN { project: p, teams: collect(t) } AS projects
            `
        ).getResults('projects');
    }

    static getProject(projectSlug) {
        return db.query(`
            MATCH (p:PROJECT {slug: {projectSlug}})
            RETURN p
            `,
            {},
            {
                projectSlug,
            }
        ).getResult('p');
    }

    static getHours(projectSlug){
      return db.query(`
        MATCH (PROJECT {slug: {projectSlug}})<-[:CONTRIBUTE]-(team:TEAM)<-[:VOLUNTEER]-(vol:USER)-[:VOLUNTEERED]->(hour:HOUR)
        RETURN {
          date:             hour.date,
          place:            hour.place,
          hours:            hour.hours,
          approved:         hour.approved,
          supervisorEmail:  hour.supervisorEmail,
          supervisorName:   hour.supervisorName,
          signature_url:    hour.signature_url,
          firstName:        vol.firstName,
          lastName:         vol.lastName,
          teamName:         team.name,
          signatureRequired: team.signatureRequired
        } as hours
      `, {}, { projectSlug })
      .getResults('hours')
      .catch((err) => {
        console.error('Error in Project#getHours', err);
        throw err;
      });
    }
}


export default Project;
