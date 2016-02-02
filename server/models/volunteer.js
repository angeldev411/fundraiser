/* @flow */

import schema from 'validate';
import stripelib from 'stripe';
import uuid from 'uuid';

const stripe = stripelib("sk_test_WNYEwSIelo8oPutqjz22lzqQ");

import config from '../config';
var db = require('neo4j-simple')(config.DB_URL)

import user from './user.js';
import util from './util.js';

const volunteer_schema = schema({
  team_short_name: {
    type: 'string',
    required: true
  },
  headshot_data: {
    type: 'string',
    message: "A headshot image is required to create a volunteer",
    required: true
  },
  bio: {
    type: 'string'
  },
  project_statement: {
    type: 'string'
  }
},{
  strip: false
});

const hours_schema = schema({
  hours: {
    type: 'number',
    required: true,
    message: " the number of hours volunteered is required"
  },
  signature_data: {
    type: 'string',
    required: true
  },
  user_uuid: {
    type: 'string',
    required: true
  },
  place: {
    type: 'string',
    required: true,
    message: " a place is required"
  },
  date: {
    type: 'date',
    required: true,
    message: " the date is required"

  },
  supervisor_name: {
    type: 'string',
    required: true,
    message: " your supervisor's name is required"
  }
},{
  strip: false, typecast: true
});


class volunteer {

  /* Primary Domain Operations */


  /* Validates input, creates a new volunteer record
     in the database.
     Expects a team_short_name */
  static create(obj){

    if(typeof(obj.password) == 'undefined'){
      obj.password = uuid.v4()
    }

    return user.assignUuid(obj)
               .then(user.validate)
               .then(volunteer.validate)
               .then(user.uploadHeadshotImage)
               .then(volunteer.insertIntoDb)

  }

  /* Logs hours to the db, uploads signature */
  static logService(obj){
    return volunteer.validateHours(obj)
                    .then(volunteer.uploadSignature)
                    .then(volunteer.logServiceToDb)

                    //.then(volunteer.updateServiceSignatureUrlInDb)
  }


  /* implementation details */

  static validateHours(obj){
    var errs = hours_schema.validate(obj);

    if(errs.length == 0){
      return Promise.resolve(obj);
    }else{
      return Promise.reject('validation error: ' + errs);
    }
  }

  /* the volunteer logs the service */
  /* fails if the user isn't a volunteer for the team */
  static logServiceToDb(obj){
    if(typeof(obj.uuid) == 'undefined'){
      obj.uuid = uuid.v4()
    }

    console.log("service log entry");
    console.log(obj);

    return db.query(`
      MATCH (volunteer:User {uuid: {user_uuid} })-[:VOLUNTEER]->(team:Team)-[:FUNDRAISING_FOR]->(project:Project)
         WHERE team.short_name = {team_short_name}

      CREATE (service:ServiceLogEntry {hours: {hours}, uuid: {uuid}, place: {place}, date: {date}, supervisor_name: {supervisor_name}, signature_url: {signature_url} })
      CREATE (volunteer)-[:LOGGED]->(service)
      CREATE (service)-[:LOGGED_FOR_TEAM]->(team)
      CREATE (service)-[:LOGGED_FOR_PROJECT]->(project)

      RETURN service`
                  , {}, obj)
             .getResults('service')

             .then(function(results){
               if(results.length > 0){
                 var service = results[0];
                 service.signature_data = obj.signature_data;
                 return Promise.resolve(service);
               }else{
                 return Promise.reject("No access: Either user is not volunteer or team short name doesn't exist");
               }
             })

  }

  static uploadSignature(obj: {signature_data: string}){
    var key = `signatures/${obj.uuid}.png`;

    var content_type = util.detectContentType(obj.signature_data);

    return new Promise( (resolve, reject) => {
      util.uploadToS3(obj.signature_data, 'raiserve', key, {content_type: content_type}, function(err, resp){
        if(err){
          reject("unable to upload signature: " + err);
        }else{
          delete(obj.signature_data);
          obj.signature_url = key;
          resolve(obj);
        }

      })
    });
  }


  static validate(obj){
    const errs = volunteer_schema.validate(obj);

    if(errs.length === 0){
      return Promise.resolve(obj);
    }else{
      return Promise.reject(errs);
    }
  }

  // expects obj.email and obj.invite_uuid
  static onboard(obj){

    console.log(obj);

    obj.new_user_uuid = uuid.v4();


    return db.query(`
      MATCH (team:Team {short_name: {team_short_name} })

      MERGE (user:User {email: {email} })
        ON CREATE SET user.first_name = {first_name}, user.last_name = {last_name}, user.password = {password}, user.uuid = {new_user_uuid}

      MERGE (user)-[volunteerism:VOLUNTEER]->(team)
        ON CREATE SET volunteerism.goal = {goal}

      MERGE (user)<-[:HEADSHOT]-(img:Image)
        ON CREATE SET img.key = {headshot_image_key}

      RETURN user
        `, {}, obj)
             .getResult('user')

  }

  static insertIntoDb(obj){
    console.log("insert vol started " + obj.email);
    return db.query(`
      MATCH (team:Team {short_name: {team_short_name} })

      MERGE (user:User {email: {email} })
        ON CREATE SET user.password = {password}, user.uuid = {uuid}, user.first_name = {first_name}, user.last_name = {last_name}, user.bio = {bio}

      MERGE (user)-[v:VOLUNTEER]->(team)
        ON CREATE SET v.project_statement = {project_statement}

      MERGE (headshot:Image)-[:HEADSHOT]->(user)
        ON CREATE SET headshot.key = {headshot_image_key}

      RETURN user
        `, {}, obj)
             .getResult('user')


  }

  static fetchByUuid(uuid){
    var base_url = "//s3.amazonaws.com/raiserve/";
    return db.query(`
      MATCH (v:User {uuid: {volunteer_uuid}})<-[:HEADSHOT]-(img:Image)
      RETURN {first_name: v.first_name, last_name: v.last_name, image_url: {base_url} + img.key, bio: v.bio} as volunteer
      `, {}, {volunteer_uuid: uuid, base_url: base_url})
             .getResult('volunteer')

  }

  static fetchSponsors(uuid){
    return db.query(`
      MATCH (u:User)-[:PLEDGED]->(p:Pledge)<-[:RAISED]->(volunteer:User {uuid: {user_uuid} }) return {first_name: u.first_name, last_name: u.last_name, email: u.email, amount: p.amount_per_hour, max_per_month: p.max_per_month} as pledges
      `, {}, {user_uuid: uuid})
          .getResults('pledges')
  }

}


module.exports = volunteer;
