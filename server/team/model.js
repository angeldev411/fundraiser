'use strict';
import uuid from 'uuid';
import mailer from '../helpers/mailer.js';
import util from '../helpers/util.js';
import neo4jDB from 'neo4j-simple';
import config from '../config';
import frontEndUrls from '../../src/urls.js';
import messages from '../messages';
import UserController from '../user/controller';
import utils from '../helpers/util';

const db = neo4jDB(config.DB_URL);

const Node = db.defineNode({
    label: ['TEAM'],
    schema: {
        id: db.Joi.string().required(),
        name: db.Joi.string().required(),
        slug: db.Joi.string().regex(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/).required(),
        logo: db.Joi.string(),
        coverImage : db.Joi.string(),
        tagline: db.Joi.string(),
        slogan: db.Joi.string(),
        description: db.Joi.string(),
        raised : db.Joi.number(),
        pledge: db.Joi.number(),
        pledgePerHour : db.Joi.number(),
        totalHours: db.Joi.number(),
        totalVolunteers: db.Joi.number(),
    },
});

class Team {
    constructor(data, projectSlug, id) {
        if (data.team.teamLeaderEmail && !utils.isEmailValid(data.team.teamLeaderEmail)) {
            return Promise.reject(messages.notEmail);
        }

        if (data.team.logoImageData) {
            return Team.uploadLogoImage(data.team)
                .then((response) => {
                    console.log('Cover Image Data', !!data.team.coverImageData);
                    return Team.uploadCoverImageIfUpdated(data.team);
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        } else {
            return Team.uploadCoverImageIfUpdated(data.team);
        }
    }
    static uploadCoverImageIfUpdated(teamData) {
        if (teamData.coverImageData) {
            return Team.uploadCoverImage(teamData)
                .then((response) => {
                    return Team.saveTeam(teamData);
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        } else {
            return Team.saveTeam(teamData);
        }
    }

    static saveTeam(teamData) {
        const team = new Node({
            id: teamData.id || uuid.v4(),
            name: teamData.name,
            slug: teamData.slug,
            ...(teamData.logo ? { logo: teamData.logo } : {}),
            ...(teamData.coverImage ? { coverImage : teamData.coverImage } : {}),
            ...(teamData.tagline ? { tagline: teamData.tagline } : {}),
            ...(teamData.slogan ? { slogan: teamData.slogan } : {}),
            ...(teamData.description ? { description: teamData.description } : {}),
            ...(teamData.raised ? { raised : teamData.raised } : {}),
            ...(teamData.pledge ? { pledge: teamData.pledge } : {}),
            ...(teamData.pledgePerHour ? { pledgePerHour : teamData.pledgePerHour } : {}),
            ...(teamData.totalHours ? { totalHours: teamData.totalHours } : {}),
            ...(teamData.totalVolunteers ? { totalVolunteers: teamData.totalVolunteers } : {}),
        }, teamData.id);

        return team.save()
        .then((response) => {
            if (teamData.id && !teamData.teamLeaderEmail) {
                // If it's an update, don't relink team creator and return team immediately
                return Promise.resolve(teamData);
            } else if (teamData.id && teamData.teamLeaderEmail) {
                // If it's an update, but new team leader email is defined
                return UserController.invite(teamData.teamLeaderEmail, 'TEAM_LEADER', teamData.slug)
                .then(() => {
                    return Promise.resolve(team.data);
                })
                .catch((err) => {
                    return Promise.reject(messages.invite.error);
                });
            } else if (!teamData.id && response.id === team.id) {
                // Link teamCreator and project
                return db.query(`
                        MATCH (t:TEAM {id: {teamId} }), (u:USER {id: {userId} }), (p:PROJECT {slug: {projectSlug} })
                        CREATE (u)-[:CREATOR]->(t)
                        CREATE (t)-[:CONTRIBUTE]->(p)
                    `,
                    {},
                    {
                        teamId: teamData.id,
                        userId: data.currentUser.id,
                        projectSlug,
                    }
                ).then(() => {
                    // Link teamLeader
                    if (teamData.teamLeaderEmail) {
                        UserController.invite(teamData.teamLeaderEmail, 'TEAM_LEADER', teamData.slug)
                        .then(() => {
                            return Promise.resolve(team.data);
                        })
                        .catch((err) => {
                            return Promise.reject(messages.invite.error);
                        });
                    }
                    return Promise.resolve(team.data);
                });
            }
            return Promise.reject('Unexpected error occurred.');
        })
        .catch((err) => {
            return Promise.reject(messages.team.required);
        });
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
            console.log('result', result);
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
            console.log('result', result);
            obj.coverImageData = null;
            obj.coverImage = `${config.S3.BASE_URL}/${result.key}`;
            return Promise.resolve(obj);
        });
    }

    /* expects obj.uuid and obj.key */
    static insertLogoImageIntoDb(obj) {
        return db.query(`
            MATCH (team:Team {uuid: {uuid} })
            CREATE (img:Image {key: {key} })

            CREATE (team)-[:LOGO]->(img)

            RETURN img
            `, {}, obj
        )
        .getResults('img');
    }

    static update(obj) {
        console.log('update team');
        console.log(obj);
        return db.query(
            `
            MERGE (project:Project)<-[pt:FUNDRAISING_FOR]-(team:Team {shortName: {shortName} })
            ON MATCH SET pt.shortDescription = {shortDescription}, pt.longDescription = {longDescription}

            RETURN team;
            `,
            {},
            obj
        )
        .getResult('team');
    }
    static fetchAdminStats(teamShortName) {
        // console.log('fas');
        // return db.query(
        //     `
        //     MATCH (project:Project)<-[pt:FUNDRAISING_FOR]-(team:Team {shortName: {shortName} })-[:LOGO]->(img:Image), (project)-[:SPLASH_IMAGE]-(pimg:Image)
        //     RETURN {name: team.name,
        //         uuid: team.uuid, shortName: team.shortName, shortDescription: COALESCE(pt.shortDescription, project.shortDescription),
        //         longDescription: COALESCE(pt.longDescription, project.longDescription), splashImageURL: {baseURL} + pimg.key, logoURL: {baseURL} + img.key} as team
        //         `
        //         ,
        //         {},
        //         { teamShortName }
        //     )
        //     .getResult('team');
    }

    static findPopular() {
        return db.query(
            `
            MATCH (project:Project)<-[pt:FUNDRAISING_FOR]-(team:Team)-[:LOGO]->(img:Image), (project)-[:SPLASH_IMAGE]->(pimg:Image)
            RETURN {
                name: team.name,
                shortName: team.shortName,
                uuid: team.uuid,
                shortDescription: COALESCE(pt.shortDescription, project.shortDescription),
                longDescription: COALESCE(pt.longDescription, project.longDescription),
                splashImageURL: {baseURL} + pimg.key, logoURL: {baseURL} + img.key
            } as teams
            `,
            {},
            { baseURL: config.S3_BASE_URL }
        )
        .getResults('teams');
    }

    static fetchVolunteers(teamShortName) {
        return db.query(
            `
            MATCH
            // grab team and volunteer
            (team:Team {shortName: {teamShortName}} )<-[:VOLUNTEER]-(v:User),

            // and headshot image
            (img:Image)-[:HEADSHOT]->(v)

            // and pledges
            OPTIONAL MATCH (v)-[:RAISED]-(pledge:Pledge)

            // and amount raised
            OPTIONAL MATCH (v)-[:RAISED]-(donation:Donation)

            RETURN {
                firstName: v.firstName,
                lastName: v.lastName,
                uuid: v.uuid,
                imageURL: {baseURL} + img.key,
                pledgeCount: count(pledge),
                averagePledge: avg(coalesce(pledge.amountPerHour, 0)),
                hourlyRate: sum(coalesce(pledge.amountPerHour, 0)),
                amountRaised: sum(coalesce(donation.amount, 0))
            } as volunteer
            `,
            {},
            {
                teamShortName,
                baseURL: config.S3_BASE_URL,
            }
        )
        .getResults('volunteer');
    }
}

export default Team;
