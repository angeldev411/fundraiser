'use strict';
const schema = require('validate');
const UUID = require('uuid');
const mailer = require('../helpers/mailer.js');
const util = require('../helpers/util.js');
const neo4jDB = require('neo4j-simple');
const config = require('../config');
const frontEndUrls = require('../../src/urls.js');

const db = neo4jDB(config.DB_URL);

const teamSchema = schema({
    name: {
        type: 'string',
        message: 'A name is required',
        match: /.{4,100}/,
    },
    creatorUUID: {
        type: 'string',
        message: 'UUID of the creating user is required',
    },
    shortName: {
        type: 'string',
        message: 'A short name is required',
        required: true,
    },
    shortDescription: {
        type: 'string',
    },
    longDescription: {
        type: 'string',
    },
    projectUUID: {
        type: 'string',
    },
    leaderUUID: {},
    logoImageData: {
    },
    uuid: {},
    invitationUUID: {},
    message: {},
});

class Team {
    static validate(obj) {
        const errs = teamSchema.validate(obj);

        return new Promise((resolve, reject) => {
            if (errs.length === 0) {
                resolve(obj);
            } else {
                reject(errs);
            }
        });
    }

    static validateUniqueShortName(obj) {
        return db.query(
            `
            MATCH (team:Team {shortName: {shortName} }) RETURN team
            `,
            {},
            obj
        )
        .getResults('team')
        .then((result) => {
            if (result.length === 0) {
                return Promise.resolve(obj);
            } else {
                return Promise.reject('duplicate team short-name :)');
            }
        });
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

    static findByShortName(shortName) {
        return db.query(
            `
            MATCH (project:Project)<-[pt:FUNDRAISING_FOR]-(team:Team {shortName: {shortName} })-[:LOGO]->(img:Image), (project)-[:SPLASH_IMAGE]-(pimg:Image)
            RETURN {
                name: team.name,
                uuid: team.uuid,
                shortName: team.shortName,
                shortDescription: COALESCE(pt.shortDescription, project.shortDescription),
                longDescription: COALESCE(pt.longDescription, project.longDescription),
                splashImageURL: {baseURL} + pimg.key, logoURL: {baseURL} + img.key
            } as team
            `,
            {},
            {
                shortName,
                baseURL: config.S3_BASE_URL,
            }
        )
        .getResult('team');
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

    static fetchVolunteers_orig(teamShortName) {
        return db.query(
            `
            MATCH (img:Image)<-[:HEADSHOT]-(v:User)-[:VOLUNTEER]->(team:Team {shortName: {teamShortName}  } )
            RETURN {
                firstName: v.firstName,
                lastName: v.lastName,
                uuid: v.uuid,
                imageURL: {baseURL} + img.key
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

    static fetchVolunteersILead(leaderUUID) {
        return db.query(
            `
            MATCH (v:User)-[:VOLUNTEER]-(t:Team)-[:LEADER]-(l:User {uuid: {leaderUUID} }),

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
                leaderUUID,
                baseURL: config.S3_BASE_URL,
            }
        )
        .getResults('volunteer');
    }

    static fetchInvitations(obj) {
        return db.query(
            `
            MATCH (team:Team {shortName: {teamShortName} })
            MATCH (user:User)<-[invite:VOLUNTEER_INVITE|LEADER_INVITE|SUPPORTER_INVITE]-(team)
            RETURN {
                email: user.email,
                type: type(invite)
            } as invite
            `,
            {},
            obj
        )
        .getResults('invite');
    }

    static inviteVolunteer(obj) {
        return team.generateVolunteerInvite(obj)
        .then(team.sendInvite);
    }

    static inviteLeader(obj) {
        return team.generateLeaderInvite(obj)
        .then(team.sendInvite);
    }

    static sendInvite(invitee) {
        const emailingOptions = {
            to: invitee.email,
            subject: 'Your invitation',
            onboard_url: `${config.DOMAIN}${frontEndUrls.SIGNUP_URL}`.replace(
                ':teamSlug', invitee.teamShortName
            ),
        };

        return mailer.sendInvite(emailingOptions);
    }

    static generateVolunteerInvite(obj) {
        obj.userUUID = UUID.v4();
        obj.inviteUUID = UUID.v4();

        // TODO: Modify to just create an empty user with a volunteer arc
        // (maybe keep the UUID thing)
        return db.query(
            `
            MATCH (team:Team {shortName: {teamShortName} })

            MERGE (user:User {email: {email}})
            ON CREATE SET user.uuid = {userUUID}

            MERGE (team)-[invite:VOLUNTEER_INVITE]->(user)
            ON CREATE SET invite.uuid = {inviteUUID}

            RETURN {
                email: {email},
                uuid: {inviteUUID},
                teamShortName: {teamShortName}
            } as invitation
            `
            , {}
            , obj
        )
        .getResult('invitation');
    }

    static generateLeaderInvite(obj) {
        obj.newUserUUID = UUID.v4();
        obj.inviteUUID = UUID.v4();

        // TODO: Modify to just create an empty user with a leader arc
        // (maybe keep the UUID thing)
        return db.query(
            `
            MATCH (team:Team {shortName: {teamShortName} })

            MERGE (user:User {email: {email}})
            ON CREATE SET user.uuid = {newUserUUID}

            MERGE (team)-[invite:LEADER_INVITE]->(user)
            ON CREATE SET invite.uuid = {inviteUUID}

            RETURN {
                email: {email},
                uuid: {inviteUUID}
            } as invitation
            `
            , {}
            , obj
        )
        .getResult('invitation');
    }
}

module.exports = Team;
