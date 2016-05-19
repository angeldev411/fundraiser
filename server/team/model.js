typeof 'use strict';
import uuid from 'uuid';
import mailer from '../helpers/mailer.js';
import util from '../helpers/util.js';
import neo4jDB from 'neo4j-simple';
import config from '../config';
import frontEndUrls from '../../src/urls.js';
import messages from '../messages';
import UserController from '../user/controller';
import utils from '../helpers/util';
import moment from 'moment';

const db = neo4jDB(config.DB_URL);

const Node = db.defineNode({
    label: ['TEAM'],
    schema: {
        id: db.Joi.string().required(),
        name: db.Joi.string().required(),
        slug: db.Joi.string().regex(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/).required(),
        deadline: db.Joi.date().required().max( moment().add(1,'year')._d ),
        logo: db.Joi.string(),
        coverImage : db.Joi.string(),
        tagline: db.Joi.string(),
        slogan: db.Joi.string(),
        description: db.Joi.string(),
        raised : db.Joi.number(),
        pledge: db.Joi.number(),
        pledgePerHour : db.Joi.number(),
        currentHours: db.Joi.number(),
        totalHours: db.Joi.number(),
        goal: db.Joi.number().min(1),
        totalVolunteers: db.Joi.number(),
        signatureRequired: db.Joi.boolean(),
        hoursApprovalRequired: db.Joi.boolean(),
    },
});

class Team {

    constructor(rawTeamData) {
        return Team.insert(rawTeamData);
    }

    static insert(rawTeamData) {
        const teamData = Team.filter({
            ...(rawTeamData),
            slug: rawTeamData.slug.toLowerCase(),
            id: uuid.v4(),
            goal: 20, // default goal
            deadline: moment().add(1,'month')._d,
            totalVolunteers: 0,
            currentHours: 0,
            totalHours: 0,
            totalSponsors: 0,
            hourlyPledge: 0,
            raised: 0,
            totalRaised: 0,
        });

        return Team.validate(teamData)
            .then(() => {
                return Team.uploadImages(teamData)
                    .then(() => {
                        return Team.saveInsert(teamData).catch((error) => {
                            return Promise.reject(error);
                        });
                    })
                    .then((result) => {
                        return Promise.resolve(teamData);
                    })
                    .catch((error) => {
                        return Promise.reject(error);
                    });
            })
            .catch((error) => {
                return Promise.reject(typeof error === 'string' ? error : messages.team.required);
            });
    }

    static update(rawTeamData) {
        const teamData = Team.filter(rawTeamData);

        return Team.validate(teamData)
            .then(() => {
                return Team.uploadImages(teamData)
                    .then(() => {
                        return Team.saveUpdate(teamData)
                            .then((result) => {
                                return Promise.resolve(result);
                            })
                            .catch((error) => {
                                return Promise.reject(error);
                            });
                    })
                    .catch((error) => {
                        return Promise.reject(error);
                    });
            })
            .catch((error) => {
                return Promise.reject(typeof error === 'string' ? error : messages.team.required);
            });
    }

    static createFakeLeader(teamId, teamLeaderId) {
        return db.query(`
                CREATE (u:USER:TEAM_LEADER:FAKE_LEADER {id: {teamLeaderId}, firstName: 'Team Leader'})
                RETURN u
            `,
            {},
            {
                teamLeaderId,
            }
        ).getResult('u')
        .then((teamLeader) => {
            // console.log(projectLeader);
            return db.query(`
                    MATCH (t:TEAM {id: {teamId} }), (u:TEAM_LEADER {id: {teamLeaderId} })
                    CREATE (u)-[:LEAD]->(t)
                `,
                {},
                {
                    teamId,
                    teamLeaderId: teamLeader.id,
                }
            );
        })
        .then(() => {
            return Promise.resolve();
        })
        .catch((err) => {
            return Promise.reject(err);
        });
    }

    static validate(teamData) {
        return Promise.all([
            Team.validateEmail(teamData),
        ]);
    }

    static validateEmail(teamData) {
        if (teamData.teamLeaderEmail && !utils.isEmailValid(teamData.teamLeaderEmail)) {
            return Promise.reject(messages.notEmail);
        }
    }

    static uploadImages(teamData) {
        const imageUploads = [];

        if (teamData.logoImageData) {
            imageUploads.push(Team.uploadLogoImage(teamData));
        }
        if (teamData.coverImageData) {
            imageUploads.push(Team.uploadCoverImage(teamData));
        }
        return Promise.all(imageUploads);
    }

    static filter(teamData) {
        return {
            id: teamData.id,
            name: teamData.name,
            slug: teamData.slug,
            ...(typeof teamData.teamLeaderEmail !== 'undefined' ? { teamLeaderEmail: teamData.teamLeaderEmail } : {}),
            ...(typeof teamData.logoImageData !== 'undefined' ? { logoImageData: teamData.logoImageData } : {}),
            ...(typeof teamData.coverImageData !== 'undefined' ? { coverImageData: teamData.coverImageData } : {}),
            ...(typeof teamData.logo !== 'undefined' ? { logo: teamData.logo } : {}),
            ...(typeof teamData.coverImage !== 'undefined' ? { coverImage : teamData.coverImage } : {}),
            ...(typeof teamData.tagline !== 'undefined' ? { tagline: teamData.tagline } : {}),
            ...(typeof teamData.slogan !== 'undefined' ? { slogan: teamData.slogan } : {}),
            ...(typeof teamData.description !== 'undefined' ? { description: teamData.description } : {}),
            ...(typeof teamData.raised !== 'undefined' ? { raised : teamData.raised } : {}),
            ...(typeof teamData.goal !== 'undefined' ? { goal : teamData.goal } : {}),
            ...(typeof teamData.deadline !== 'undefined' ? { deadline : teamData.deadline } : {}),
            ...(typeof teamData.totalRaised !== 'undefined' ? { totalRaised : teamData.totalRaised } : {}),
            ...(typeof teamData.hourlyPledge !== 'undefined' ? { hourlyPledge : teamData.hourlyPledge } : {}),
            ...(typeof teamData.currentHours !== 'undefined' ? { currentHours: teamData.currentHours } : {}),
            ...(typeof teamData.totalHours !== 'undefined' ? { totalHours: teamData.totalHours } : {}),
            ...(typeof teamData.totalVolunteers !== 'undefined' ? { totalVolunteers: teamData.totalVolunteers } : {}),
            ...(typeof teamData.totalSponsors !== 'undefined' ? { totalSponsors: teamData.totalSponsors } : {}),
            ...(typeof teamData.signatureRequired !== 'undefined' ? { signatureRequired: teamData.signatureRequired } : {}),
            ...(typeof teamData.hoursApprovalRequired !== 'undefined' ? { hoursApprovalRequired: teamData.hoursApprovalRequired } : {}),
            ...(typeof teamData.fakeLeaderId !== 'undefined' ? { fakeLeaderId: teamData.fakeLeaderId } : {}),
        };
    }

    static saveInsert(teamData) {
        const teamNode = new Node(teamData);

        return teamNode.save();
    }

    static saveUpdate(teamData) {
        const teamNode = new Node(teamData, teamData.id);

        return teamNode.save();
    }

    static linkTeamCreatorAndProject(teamId, currentUserId, projectSlug) {
        return db.query(`
                MATCH (t:TEAM {id: {teamId} }), (u:USER {id: {userId} }), (p:PROJECT {slug: {projectSlug} })
                CREATE (u)-[:CREATOR]->(t)
                CREATE (t)-[:CONTRIBUTE]->(p)
            `,
            {},
            {
                teamId,
                userId: currentUserId,
                projectSlug,
            }
        );
    }

    static inviteTeamLeader(teamData) {
        if (teamData.teamLeaderEmail) {
            UserController.invite(teamData.teamLeaderEmail, 'TEAM_LEADER', teamData.slug)
            .then(() => {
                return Promise.resolve(teamData);
            })
            .catch((err) => {
                return Promise.reject(messages.invite.error);
            });
        } else {
            return Promise.resolve(teamData);
        }
    }

    static getByProject(userId, projectSlug) {
        return db.query(`
                MATCH (teams:TEAM)-[:CONTRIBUTE]->(project:PROJECT {slug: {projectSlug}})<-[:LEAD]-(user:PROJECT_LEADER { id: {userId}})
                RETURN teams
            `,
            {},
            {
                userId,
                projectSlug,
            }
        )
        .getResults('teams');
    }

    static getBySlugs(projectSlug, teamSlug) {
        return db.query(`
                MATCH (team:TEAM {slug: {teamSlug} })-[:CONTRIBUTE]->(project:PROJECT {slug: {projectSlug}})
                RETURN team
            `,
            {},
            {
                teamSlug,
                projectSlug,
            }
        )
        .getResult('team');
    }

    static isTeamLeaderTeamOwner(teamId, teamLeaderId) {
        return db.query(`
                MATCH (t:TEAM {id: {teamId}})<-[:LEAD]-(u:TEAM_LEADER {id: {teamLeaderId}})
                RETURN { team: t, user: u } AS result
            `,
            {},
            {
                teamId,
                teamLeaderId,
            }
        ).getResult('result');
    }

    static isTeamLeaderTeamOwnerBySlug(teamSlug, teamLeaderId) {
        return db.query(`
                MATCH (t:TEAM {slug: {teamSlug}})<-[:LEAD]-(u:TEAM_LEADER {id: {teamLeaderId}})
                RETURN { team: t, user: u } AS result
            `,
            {},
            {
                teamSlug,
                teamLeaderId,
            }
        ).getResult('result');
    }

    static isProjectLeaderIndirectTeamOwner(teamId, projectLeaderId) {
        return db.query(`
                MATCH (t:TEAM {id: {teamId}})-->(:PROJECT)<--(u:PROJECT_LEADER {id: {projectLeaderId}})
                RETURN { team: t, user: u } AS result
            `,
            {},
            {
                teamId,
                projectLeaderId,
            }
        ).getResult('result');
    }

    static uploadLogoImage(obj) {
        if (typeof obj.logoImageData === 'undefined') {
            return Promise.reject('No Logo Image provided');
        }

        return util.uploadRsImage({
            key_prefix: `teams/`,
            uuid: obj.uuid || obj.id,
            image_data: obj.logoImageData,
        }, 'logo')
        .then((result) => {
            obj.logoImageData = null;
            obj.logo = `${config.S3.BASE_URL}/${result.key}`;
            return Promise.resolve(obj);
        });
    }

    static uploadCoverImage(obj) {
        if (typeof obj.coverImageData === 'undefined') {
            return Promise.reject('No Logo Image provided');
        }
        return util.uploadRsImage({
            key_prefix: `teams/`,
            uuid: obj.uuid || obj.id,
            image_data: obj.coverImageData,
        }, 'cover')
        .then((result) => {
            obj.coverImageData = null;
            obj.coverImage = `${config.S3.BASE_URL}/${result.key}`;
            return Promise.resolve(obj);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
    }

    static getProject(team) {
        return db.query(`
            MATCH (project:PROJECT)<-[:CONTRIBUTE]-(team:TEAM { id: {teamId} })
            RETURN project
            `,
            {},
            {
                teamId: team.id,
            }
        ).getResult('project');
    }

    static getStats(teamSlug) {
        return db.query(
            `
            MATCH (team:TEAM {slug: {teamSlug}})
            RETURN {totalVolunteers: team.totalVolunteers, totalSponsors: team.totalSponsors, totalRaised: team.totalRaised} AS stats
            `,
            {},
            {
                teamSlug,
            }
        )
        .getResult('stats');
    }

    static removeTeam(teamId, userId) {
        console.log(teamId, userId);
        return db.query(
            `
            MATCH (team:TEAM {id: {teamId}})-[:CONTRIBUTE]->(:PROJECT)<-[:LEAD]-(:PROJECT_LEADER { id: {userId}})
            SET team:TEAM_DISABLED
            REMOVE team:TEAM
            RETURN team
            `,
            {},
            {
                teamId,
                userId,
            }
        )
        .getResult('team');
    }
}

export default Team;
