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

class Team {
    constructor(data, projectSlug, id) {
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

        if (data.team.teamLeaderEmail && !utils.isEmailValid(data.team.teamLeaderEmail)) {
            return Promise.reject(messages.notEmail);
        }

        const team = new Node({
            id: data.team.id || uuid.v4(),
            name: data.team.name,
            slug: data.team.slug,
            logo: data.team.logo,
            coverImage : data.team.coverImage,
            tagline: data.team.tagline,
            slogan: data.team.slogan,
            description: data.team.description,
            raised : data.team.raised,
            pledge: data.team.pledge,
            pledgePerHour : data.team.pledgePerHour,
            totalHours: data.team.totalHours,
            totalVolunteers: data.team.totalVolunteers,
        }, id);

        return team.save()
        .then((response) => {
            if (id && !data.team.teamLeaderEmail) {
                // If it's an update, don't relink team creator and return team immediately
                return Promise.resolve(team.data);
            } else if (id && data.team.teamLeaderEmail) {
                // If it's an update, but new team leader email is defined
                return UserController.invite(data.team.teamLeaderEmail, 'TEAM_LEADER', data.team.slug)
                .then(() => {
                    return Promise.resolve(team.data);
                })
                .catch((err) => {
                    return Promise.reject(messages.invite.error);
                });
            } else if (!id && response.id === team.id) {
                // Link teamCreator and project
                return db.query(`
                        MATCH (t:TEAM {id: {teamId} }), (u:USER {id: {userId} }), (p:PROJECT {slug: {projectSlug} })
                        CREATE (u)-[:CREATOR]->(t)
                        CREATE (t)-[:CONTRIBUTE]->(p)
                    `,
                    {},
                    {
                        teamId: team.data.id,
                        userId: data.currentUser.id,
                        projectSlug,
                    }
                ).then(() => {
                    // Link teamLeader
                    if (data.team.teamLeaderEmail) {
                        UserController.invite(data.team.teamLeaderEmail, 'TEAM_LEADER', data.team.slug)
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

    static isProjectLeaderIndirectTeamOwner(teamId, projectLeaderId) {
        return db.query(`
                MATCH (t:TEAM {id: {teamId}})<--(u:PROJECT_LEADER {id: {projectLeaderId}})
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
        console.log('upload logo image ' + obj.uuid);

        if (typeof obj.logoImageData === 'undefined') {
            return Promise.reject('No Logo Image provided');
        }

        return util.uploadRsImage({
            key_prefix: config.TEAM_IMAGES_FOLDER,
            uuid: obj.uuid,
            image_data: obj.logoImageData,
        })
        .then((result) => {
            console.log('returning team logo image...');

            obj.logo_image_key = result.key;
            obj.logoImageData = null;
            console.log(obj);

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
