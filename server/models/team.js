import schema from 'validate';
import stripelib from 'stripe';
import uuid from 'uuid';
import mailer from './mailer.js';
import util from './util.js';

const stripe = stripelib("sk_test_WNYEwSIelo8oPutqjz22lzqQ");

import config from '../config';
var db = require('neo4j-simple')(config.DB_URL);

const team_schema = schema({
  name: {
    type: 'string',
    message: "A name is required",
    match: /.{4,100}/
  },
  creator_uuid: {
    type: 'string',
    message: 'UUID of the creating user is required'
  },
  short_name: {
    type: 'string',
    message: " a short name is required",
    required: true
  },
  short_description: {

  },
  long_description: {

  },
  project_uuid: {
    type: 'string'
  },
  leader_uuid: {},
  logo_image_data: {
  },
  uuid: {},
  invitation_uuid: {},
  message: {}
});

class team {

  static assignUuid(obj){
    if(typeof(obj.uuid) == 'undefined'){
      obj.uuid = uuid.v4();
    }
    return Promise.resolve(obj)
  }

  static validate(obj){
    const errs = team_schema.validate(obj);

    return new Promise((resolve, reject) => {
      if(errs.length === 0){
        resolve(obj);
      }else{
        reject(errs);
      }
    });
  }

  static validateUniqueShortName(obj){
    return db.query(`
                     MATCH (team:Team {short_name: {short_name} }) RETURN team
     `, {}, obj)
             .getResults('team')
             .then(function(result){
               if(result.length == 0){
                 return Promise.resolve(obj)
               }else{
                 return Promise.reject("duplicate team short-name :)")
               }
             })
  }


  static uploadLogoImage(obj){
    console.log("upload logo image " + obj.uuid);

    if(typeof(obj.logo_image_data) == 'undefined')
      return Promise.reject("No Logo Image provided");

    return util.uploadRsImage({key_prefix: 'images/logos/', uuid: obj.uuid, image_data: obj.logo_image_data})
               .then(function(result){
                 console.log("returning team logo image...");

                 obj.logo_image_key = result.key;
                 obj.logo_image_data = null;
                 console.log(obj)

                   return Promise.resolve(obj);
               })
  };

  /* expects obj.uuid and obj.key */
  static insertLogoImageIntoDb(obj){
    return db.query(`
                MATCH (team:Team {uuid: {uuid} })
                CREATE (img:Image {key: {key} })

                CREATE (team)-[:LOGO]->(img)

                RETURN img
           `, {}, obj)
             .getResults('img');
  }

  //static fetchAdminStats(team_short_name){
  //  console.log('fas');
  //  return db.query(`
  //                  MATCH (project:Project)<-[pt:FUNDRAISING_FOR]-(team:Team {short_name: {short_name} })-[:LOGO]->(img:Image), (project)-[:SPLASH_IMAGE]-(pimg:Image)
  //                  RETURN {name: team.name,
  //                           uuid: team.uuid, short_name: team.short_name, short_description: COALESCE(pt.short_description, project.short_description),
  //                           long_description: COALESCE(pt.long_description, project.long_description), splash_image_url: {base_url} + pimg.key, logo_url: {base_url} + img.key} as team
  //                  `
  //                , {}, {team_short_name: team_short_name})
  //           .getResult('team')
 // }



  static findByShortName(short_name){
    return db.query(`MATCH (project:Project)<-[pt:FUNDRAISING_FOR]-(team:Team {short_name: {short_name} })-[:LOGO]->(img:Image), (project)-[:SPLASH_IMAGE]-(pimg:Image)
                     RETURN {name: team.name,
                             uuid: team.uuid, short_name: team.short_name, short_description: COALESCE(pt.short_description, project.short_description),
                             long_description: COALESCE(pt.long_description, project.long_description), splash_image_url: {base_url} + pimg.key, logo_url: {base_url} + img.key} as team`
        , {}, {short_name: short_name, base_url: "//s3.amazonaws.com/raiserve/"})
             .getResult('team')
  }



  static findPopular(){
    return db.query(`MATCH (project:Project)<-[pt:FUNDRAISING_FOR]-(team:Team)-[:LOGO]->(img:Image), (project)-[:SPLASH_IMAGE]->(pimg:Image)
                     RETURN {name: team.name, short_name: team.short_name,
                             uuid: team.uuid, short_description: COALESCE(pt.short_description, project.short_description),
                             long_description: COALESCE(pt.long_description, project.long_description), splash_image_url: {base_url} + pimg.key, logo_url: {base_url} + img.key} as teams`
        , {}, {base_url: "//s3.amazonaws.com/raiserve/"})
             .getResults('teams')
  }


  static fetchVolunteers_orig(team_short_name){
    return db.query(`
          MATCH (img:Image)<-[:HEADSHOT]-(v:User)-[:VOLUNTEER]->(team:Team {short_name: {team_short_name}  } )
          RETURN {first_name: v.first_name, last_name: v.last_name, uuid: v.uuid, image_url: {base_url} + img.key} as volunteer
          `
                  , {}
                  , {team_short_name: team_short_name, base_url: '//s3.amazonaws.com/raiserve/'})
             .getResults('volunteer')
  }


  static fetchVolunteers(team_short_name){
    return db.query(`
          MATCH
             // grab team and volunteer
             (team:Team {short_name: {team_short_name}} )<-[:VOLUNTEER]-(v:User),

             // and headshot image
             (img:Image)-[:HEADSHOT]->(v)

             // and pledges
             OPTIONAL MATCH (v)-[:RAISED]-(pledge:Pledge)

             // and amount raised
             OPTIONAL MATCH (v)-[:RAISED]-(donation:Donation)

          RETURN {first_name: v.first_name, last_name: v.last_name, uuid: v.uuid, image_url: {base_url} + img.key, pledge_count: count(pledge), average_pledge: avg(coalesce(pledge.amount_per_hour, 0)), hourly_rate: sum(coalesce(pledge.amount_per_hour, 0)), amount_raised: sum(coalesce(donation.amount, 0)) } as volunteer
          `
                  , {}
                  , {team_short_name: team_short_name, base_url: '//s3.amazonaws.com/raiserve/'})
             .getResults('volunteer')
  }


  static fetchVolunteersILead(leader_uuid){
    return db.query(`
          MATCH (v:User)-[:VOLUNTEER]-(t:Team)-[:LEADER]-(l:User {uuid: {leader_uuid} }),

             // and headshot image
             (img:Image)-[:HEADSHOT]->(v)

             // and pledges
             OPTIONAL MATCH (v)-[:RAISED]-(pledge:Pledge)

             // and amount raised
             OPTIONAL MATCH (v)-[:RAISED]-(donation:Donation)

          RETURN {first_name: v.first_name, last_name: v.last_name, uuid: v.uuid, image_url: {base_url} + img.key, pledge_count: count(pledge), average_pledge: avg(coalesce(pledge.amount_per_hour, 0)), hourly_rate: sum(coalesce(pledge.amount_per_hour, 0)), amount_raised: sum(coalesce(donation.amount, 0)) } as volunteer
          `
                  , {}
                  , {leader_uuid: leader_uuid, base_url: '//s3.amazonaws.com/raiserve/'})
             .getResults('volunteer')
  }



  static fetchInvitations(obj){
    return db.query(`

       MATCH (team:Team {short_name: {team_short_name} })
       MATCH (user:User)<-[invite:VOLUNTEER_INVITE|LEADER_INVITE|SUPPORTER_INVITE]-(team)
       RETURN {email: user.email, type: type(invite)} as invite
          `
                  , {}
                  , obj)
             .getResults('invite')
  }

  static inviteVolunteer(obj){
    return team.generateVolunteerInvite(obj)
               .then(team.sendVolunteerInvite)
  }

  static sendVolunteerInvite(invite){
    var merge = {to: invite.email, subject: "Your invitation", onboard_url: `http://raiserve.org/#/join/${invite.team_short_name}`}

    return mailer.sendVolunteerInvite(merge);
  }

  static generateVolunteerInvite(obj){
    obj.invite_uuid = uuid.v4();
    obj.user_uuid = uuid.v4();

    return db.query(`
          MATCH (team:Team {short_name: {team_short_name} })

          MERGE (user:User {email: {email}})
            ON CREATE SET user.uuid = {user_uuid}

          MERGE (team)-[invite:VOLUNTEER_INVITE]->(user)
          ON CREATE SET invite.uuid = {invite_uuid}

          RETURN {email: {email}, uuid: {invite_uuid}, team_short_name: {team_short_name}} as invitation

          `
                  , {}
                  , obj)
             .getResult('invitation')
  }

  static inviteSupporter(obj){
    obj.invite_uuid = uuid.v4();
    obj.new_user_uuid = uuid.v4();

    return db.query(`
          MATCH (team:Team {short_name: {team_short_name} })

          MERGE (user:User {email: {email}})
            ON CREATE SET user.uuid = {new_user_uuid}

          MERGE (team)-[invite:SUPPORTER_INVITE]->(user)
          ON CREATE SET invite.uuid = {invite_uuid}

          RETURN {email: {email}, uuid: {invite_uuid} } as invitation
          `
                  , {}
                  , obj)
             .getResult('invitation')
  }

  static inviteLeader(obj){
    return team.generateLeaderInvite(obj)
        .then(team.sendLeaderInvite);
  }

  static sendLeaderInvite(invite){
    console.log('sending leader invite email:');
    console.log(invite);

    var merge = {to: invite.email, subject: "Your invitation", onboard_url: `http://raiserve.org/#/leader/invitation/${invite.uuid}`}

    return mailer.sendLeaderInvite(merge);
  }

  static generateLeaderInvite(obj){
    obj.new_user_uuid = uuid.v4();
    obj.invite_uuid = uuid.v4();

    return db.query(`
          MATCH (team:Team {short_name: {team_short_name} })

          MERGE (user:User {email: {email}})
            ON CREATE SET user.uuid = {new_user_uuid}

          MERGE (team)-[invite:LEADER_INVITE]->(user)
          ON CREATE SET invite.uuid = {invite_uuid}

          RETURN {email: {email}, uuid: {invite_uuid} } as invitation

          `
                  , {}
                  , obj)
             .getResult('invitation')
    }


}

module.exports = team;
