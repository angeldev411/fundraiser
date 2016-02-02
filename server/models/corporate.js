import schema from 'validate';
import stripelib from 'stripe';
import uuid from 'uuid';

import project from './project.js';
import team from './team.js';
import util from './util.js';
import config from '../config';
var db = require('neo4j-simple')(config.DB_URL);

const project_schema = schema({
  name: {
    type: 'string',
    message: "A name is required"
  },
  creator_uuid: {
    type: 'string',
    message: 'UUID of the creating user is required'
  },
  short_name: {
    type: 'string'
  },
  short_description: {

  },
  long_description: {

  },
  uuid: {
    type: 'string'
  },
  splash_image_data: {
    requried: true
  }}, {strip: false});

const team_schema = schema({
  leader_uuid: {}
}, {strip: false});

class corporate{

  static findProjects(uuid){

  }

  static createProject(obj){
    return project.validate(obj)
                  .then(project.validateUniqueName)
                  .then(project.uploadSplashImage)
                  .then(corporate.insertProjectIntoDb)
  }

  static insertProjectIntoDb(obj){
    console.log("insert proj from corporate got");
    console.log(obj);
    if(typeof(obj.uuid) == 'undefined'){
      obj.uuid = uuid.v4();
    }

    for(var k in obj){
      console.log("obj has " + k);
    }

    return db.query(`
                MATCH (creator:User {uuid: {creator_uuid}})

                CREATE (project:Project
                        {name: {name},
                         short_name: {short_name},
                         short_description: {short_description},
                         long_description: {long_description},
                         uuid: {uuid} })

                CREATE (creator)-[:CREATOR]->(project)
                CREATE (creator)-[:OWNER]->(project)
                CREATE (splash:Image {key: {splash_image_key}})-[:SPLASH_IMAGE]->(project)
                RETURN project

     `, {}, obj)
             .getResult('project')
  }

  static inviteUser(obj){
    switch(obj.role){
      case 'VOLUNTEER':
        return team.inviteVolunteer(obj);
        break;
      case 'LEADER':
        return team.inviteLeader(obj);
        break;
      case 'SUPPORTER':
        return team.inviteSupporter(obj);
        break;
      default:
        return Promise.reject("no role provided to inviteUser");
    }
  }



  static createTeam(obj){
    return team.assignUuid(obj)
               .then(team.validate)
               .then(corporate.validateTeam)
               .then(team.validateUniqueShortName)
               .then(team.uploadLogoImage)
               .then(corporate.insertTeamIntoDb)
  }

  static validateTeam(obj){
    const errs = team_schema.validate(obj);

    return new Promise((resolve, reject) => {
      if(errs.length === 0){
        resolve(obj);
      }else{
        reject(errs);
      }
    });
  }


  static insertTeamIntoDb(obj){

    if(!obj.short_description)
      obj.short_description = null;

    if(!obj.long_description)
      obj.long_description = null;

    return db.query(`
                MATCH (creator:User {uuid: {creator_uuid} })
                MATCH (project:Project {uuid: {project_uuid} })

                CREATE (team:Team
                        {name: {name},
                         short_name: {short_name},
                         uuid: {uuid} })


                CREATE (creator)-[:CREATOR]->(team)


                CREATE (team)-[raising:FUNDRAISING_FOR {short_description: {short_description}, long_description: {long_description}  }]->(project)

                CREATE (img:Image {key: {logo_image_key} })
                CREATE (team)-[:LOGO]->(img)


                RETURN team

     `, {}, obj)
             .getResults('team')
             .then(function(result){
               result[0].logo_image_data = obj.logo_image_data
               console.log("CREATED TEAM, UUID IS: " + result[0].uuid);
               return Promise.resolve(result[0])
             })

  }


  static fetchTeamStats(team_short_name){
    return db.query(`
                  MATCH (project:Project)<-[pt:FUNDRAISING_FOR]-(team:Team {short_name: {team_short_name} })-[:LOGO]->(img:Image), (project)-[:SPLASH_IMAGE]-(pimg:Image)
                    RETURN {name: team.name,
                             uuid: team.uuid, short_name: team.short_name, short_description: COALESCE(pt.short_description, project.short_description),
                             long_description: COALESCE(pt.long_description, project.long_description), splash_image_url: {base_url} + pimg.key, logo_url: {base_url} + img.key} as team

     `, {}, {team_short_name: team_short_name, base_url: "//s3.amazonaws.com/raiserve/"})
             .getResult('team')


  }


  static updateTeam(obj){
    console.log('update team');
    console.log(obj);
    return db.query(`
         MERGE (project:Project)<-[pt:FUNDRAISING_FOR]-(team:Team {short_name: {short_name} })
           ON MATCH SET pt.short_description = {short_description}, pt.long_description = {long_description}

           RETURN team;
      `, {}, obj)
      .getResult('team');
  }




}

module.exports = corporate;
