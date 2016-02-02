import schema from 'validate';
import stripelib from 'stripe';
import uuid from 'uuid';

import util from './util.js';

const stripe = stripelib("sk_test_WNYEwSIelo8oPutqjz22lzqQ");

import config from '../config';
var db = require('neo4j-simple')(config.DB_URL);

const project_schema = schema({
  name: {
    type: 'string',
    message: "A name teis required"
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
    required: true
  }

});


class project{


  /* is this a security vulnerability?
     malicious user could post this param to match exsting */
  static assignUuid(obj){
    if(typeof(obj.uuid) == 'undefined'){
      obj.uuid = uuid.v4();
    }
    return Promise.resolve(obj)
  }


  static validate(obj){
    const errs = project_schema.validate(obj);

    return new Promise((resolve, reject) => {
      if(errs.length === 0){
        resolve(obj);
      }else{
        reject(errs);
      }
    });
  }

  static validateUniqueName(obj){

    return db.query(`
                     MATCH (project:Project {name: {name} }) RETURN project
     `, {}, obj)
             .getResults('project')
             .then(function(result){
               if(result.length == 0){
                 return obj
               }else{
                 return Promise.reject("duplicate project name :)")
               }
             })
  }

  /* deprecated */
  static insertIntoDbdeprecated(obj){
    if(typeof(obj.uuid) == 'undefined'){
      obj.uuid = uuid.v4();
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

                RETURN project

     `, {}, obj)
             .getResults('project')
             .then(function(result){
               // we put the image url back in
               result[0].splash_image_data = obj.splash_image_data;
               return Promise.resolve(result[0]);
             })

  }


  static uploadSplashImage(obj: {splash_image_data: string}){
    return util.uploadRsImage({key_prefix: 'images/splash/', uuid: obj.uuid, image_data: obj.splash_image_data})
               .then(function(result){
                 obj.splash_image_key = result.key;
                 return Promise.resolve(obj);
               })
  };

  /* expects obj.uuid and obj.key */
  static insertSplashImageIntoDb(obj){
    console.log("trying to insert splash image into db")
    console.log(obj.uuid)
    return db.query(`
                MATCH (project:Project {uuid: {uuid} })
                CREATE (img:Image {key: {key} })
                CREATE (project)-[:SPLASH_IMAGE]->(img)

                RETURN img
           `, {}, obj)
             .getResults('img')
  }



  //SECURITY: explicitly define return attributes
  static findByShortName(short_name){
    return db.query(`MATCH (project:Project {short_name: {short_name} }) RETURN project`
                  , {}, {short_name: short_name})
             .getResults('project')

  }

  static fetchAdminStats(project_uuid){
    return db.query(`MATCH (project:Project {uuid: {project_uuid} }) RETURN project`
                  , {}, {project_uuid: project_uuid})
             .getResult('project')
  }

  //SECURITY: explicitly define return attributes
  static findAll(){
    return db.query(`MATCH (project:Project) RETURN project`
                  , {}, {})
             .getResults('project')

  }

  //SECURITY: explicitly define return attributes
  static findAllTeams(project_uuid){
    return db.query(`MATCH (project:Project {uuid: {project_uuid} })<-[:FUNDRAISING_FOR]-(team:Team) RETURN team`
                  , {}, {project_uuid: project_uuid})
             .getResults('team')

  }

};


module.exports = project;
