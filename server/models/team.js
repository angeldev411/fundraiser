import schema from 'validate';
import uuid from 'uuid';
import mailer from '../helpers/mailer.js';
import util from '../helpers/util.js';
import neo4jDB from 'neo4j-simple';
import config from '../config';

const db = neo4jDB(config.DB_URL);

const teamSchema = schema({
    name: {
        type: 'string',
        message: 'A name is required',
        match: /.{4,100}/,
    },
    creator_uuid: {
        type: 'string',
        message: 'UUID of the creating user is required',
    },
    shortName: {
        type: 'string',
        message: 'A short name is required',
        required: true,
    },
    short_description: {
        type: 'string',
    },
    long_description: {
        type: 'string',
    },
    project_uuid: {
        type: 'string',
    },
    leaderUUID: {},
    logo_image_data: {
    },
    uuid: {},
    invitation_uuid: {},
    message: {},
});

class team {
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

        if (typeof obj.logo_image_data === 'undefined') {
            return Promise.reject('No Logo Image provided');
        }

        return util.uploadRsImage({
            key_prefix: config.TEAM_IMAGES_FOLDER,
            uuid: obj.uuid,
            image_data: obj.logo_image_data,
        })
        .then((result) => {
            console.log('returning team logo image...');

            obj.logo_image_key = result.key;
            obj.logo_image_data = null;
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

    // static fetchAdminStats(teamShortName) {
    //  console.log('fas');
    //  return db.query(`
    //                  MATCH (project:Project)<-[pt:FUNDRAISING_FOR]-(team:Team {shortName: {shortName} })-[:LOGO]->(img:Image), (project)-[:SPLASH_IMAGE]-(pimg:Image)
    //                  RETURN {name: team.name,
    //                           uuid: team.uuid, shortName: team.shortName, short_description: COALESCE(pt.short_description, project.short_description),
    //                           long_description: COALESCE(pt.long_description, project.long_description), splash_image_url: {base_url} + pimg.key, logo_url: {base_url} + img.key} as team
    //                  `
    //                , {}, {teamShortName: teamShortName})
    //           .getResult('team')
    // }

    static findByShortName(shortName) {
        return db.query(
            `
            MATCH (project:Project)<-[pt:FUNDRAISING_FOR]-(team:Team {shortName: {shortName} })-[:LOGO]->(img:Image), (project)-[:SPLASH_IMAGE]-(pimg:Image)
            RETURN {name: team.name,
                uuid: team.uuid, shortName: team.shortName, short_description: COALESCE(pt.short_description, project.short_description),
                long_description: COALESCE(pt.long_description, project.long_description), splash_image_url: {base_url} + pimg.key, logo_url: {base_url} + img.key} as team
            `,
            {},
            {
                shortName,
                base_url: config.S3_BASE_URL,
            }
        )
        .getResult('team');
    }

    static findPopular() {
        return db.query(
            `
            MATCH (project:Project)<-[pt:FUNDRAISING_FOR]-(team:Team)-[:LOGO]->(img:Image), (project)-[:SPLASH_IMAGE]->(pimg:Image)
            RETURN {name: team.name, shortName: team.shortName,
                uuid: team.uuid, short_description: COALESCE(pt.short_description, project.short_description),
                long_description: COALESCE(pt.long_description, project.long_description), splash_image_url: {base_url} + pimg.key, logo_url: {base_url} + img.key} as teams
            `,
            {},
            { base_url: config.S3_BASE_URL }
        )
        .getResults('teams');
    }

    static fetchVolunteers_orig(teamShortName) {
        return db.query(
            `
            MATCH (img:Image)<-[:HEADSHOT]-(v:User)-[:VOLUNTEER]->(team:Team {shortName: {teamShortName}  } )
            RETURN {first_name: v.first_name, last_name: v.last_name, uuid: v.uuid, image_url: {base_url} + img.key} as volunteer
            `,
            {},
            {
                teamShortName,
                base_url: config.S3_BASE_URL,
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

            RETURN {first_name: v.first_name, last_name: v.last_name, uuid: v.uuid, image_url: {base_url} + img.key, pledge_count: count(pledge), average_pledge: avg(coalesce(pledge.amount_per_hour, 0)), hourly_rate: sum(coalesce(pledge.amount_per_hour, 0)), amount_raised: sum(coalesce(donation.amount, 0)) } as volunteer
            `,
            {},
            {
                teamShortName,
                base_url: config.S3_BASE_URL,
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

            RETURN {first_name: v.first_name, last_name: v.last_name, uuid: v.uuid, image_url: {base_url} + img.key, pledge_count: count(pledge), average_pledge: avg(coalesce(pledge.amount_per_hour, 0)), hourly_rate: sum(coalesce(pledge.amount_per_hour, 0)), amount_raised: sum(coalesce(donation.amount, 0)) } as volunteer
            `,
            {},
            {
                leaderUUID,
                base_url: config.S3_BASE_URL,
            }
        )
        .getResults('volunteer');
    }

    static fetchInvitations(obj) {
        return db.query(
            `
            MATCH (team:Team {shortName: {teamShortName} })
            MATCH (user:User)<-[invite:VOLUNTEER_INVITE|LEADER_INVITE|SUPPORTER_INVITE]-(team)
            RETURN {email: user.email, type: type(invite)} as invite
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
            onboard_url: `${config.DOMAIN}${config.SIGNUP_URL}`.replace(
                ':teamSlug', invitee.teamShortName
            ),
        };

        return mailer.sendInvite(emailingOptions);
    }

    static generateVolunteerInvite(obj) {
        obj.user_uuid = uuid.v4();
        obj.invite_uuid = uuid.v4();

        // TODO: Modify to just create an empty user with a volunteer arc
        // (maybe keep the UUID thing)
        return db.query(
            `
            MATCH (team:Team {shortName: {teamShortName} })

            MERGE (user:User {email: {email}})
            ON CREATE SET user.uuid = {user_uuid}

            MERGE (team)-[invite:VOLUNTEER_INVITE]->(user)
            ON CREATE SET invite.uuid = {invite_uuid}

            RETURN {email: {email}, uuid: {invite_uuid}, teamShortName: {teamShortName}} as invitation

            `
            , {}
            , obj
        )
        .getResult('invitation');
    }

    static generateLeaderInvite(obj) {
        obj.new_user_uuid = uuid.v4();
        obj.invite_uuid = uuid.v4();

        // TODO: Modify to just create an empty user with a leader arc
        // (maybe keep the UUID thing)
        return db.query(
            `
            MATCH (team:Team {shortName: {teamShortName} })

            MERGE (user:User {email: {email}})
            ON CREATE SET user.uuid = {new_user_uuid}

            MERGE (team)-[invite:LEADER_INVITE]->(user)
            ON CREATE SET invite.uuid = {invite_uuid}

            RETURN {email: {email}, uuid: {invite_uuid} } as invitation

            `
            , {}
            , obj
        )
        .getResult('invitation');
    }
}

export default team;
