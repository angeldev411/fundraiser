import schema from 'validate';
import uuid from 'uuid';

import config from '../config';
var db = require('neo4j-simple')(config.DB_URL)

const approval_schema = schema({
    leader_uuid: {},
    service_uuid: {},
    signature_data: {}
});




class leader {

  static approveService(approval){
    return leader.validateApproval(approval)
                 .then(leader.updateServiceApprovalInDb);
  }

  static validateApproval(obj){
    const errs = approval_schema.validate(obj);

    return new Promise((resolve, reject) => {
      if(errs.length === 0){
        resolve(obj);
      }else{
        reject(errs);
      }
    });
  }

  static updateServiceApprovalInDb(obj){
    return db.query(`
      MATCH (service:ServiceLogEntry {uuid: {service_uuid} }), (leader:User {uuid: {leader_uuid} })

      CREATE (leader)-[:APPROVED]->(service)
      RETURN service
      `, {}, obj).getResults('service')
             .then(function(result){
        console.log("result is ")
          console.log(result)
          return Promise.resolve(result)
      })

  }

  /* expects team_short_name and user_uuid */
  /* TODO: no team uuid filter anyway */
  static findServiceNeedingApprovalByTeam(obj){
    console.log(obj)
    return db.query(`

        MATCH (volunteer:User)-[:LOGGED]->(service:ServiceLogEntry)-[r:LOGGED_FOR_TEAM]->(team:Team)<-[:LEADER]-(leader:User {uuid: {user_uuid}})
             WHERE NOT ()-[:APPROVED]->(service)
        RETURN {hours: service.hours, first_name: volunteer.first_name, last_name: volunteer.last_name, service_uuid: service.uuid}as service
        `, {}, obj).getResults('service');
  }

  /* expects only user_uuid */
  static findAllServiceNeedingApproval(obj){
    console.log(obj)
    return db.query(`

        MATCH (volunteer:User)-[:LOGGED]->(service:ServiceLogEntry)-[r:LOGGED_FOR_TEAM]->(team:Team)<-[:LEADER]-(leader:User {uuid: {user_uuid}})
             WHERE NOT ()-[:APPROVED]->(service)
        RETURN {hours: service.hours, first_name: volunteer.first_name, last_name: volunteer.last_name, service_uuid: service.uuid}as service
        `, {}, obj).getResults('service');
  }

  
  static fetchTeams(uuid){
    var obj = {uuid: uuid};
    return db.query(`
      MATCH (user:User {uuid: {uuid} })-[:LEADER]->(team:Team) RETURN {name: team.name, short_name: team.short_name} as team
        `, {}, obj)
             .getResults('team')
  }

  // expects obj.email and obj.invite_uuid
  static onboard(obj){
    console.log(obj)
    return db.query(`
      MATCH (team:Team)-[invite:LEADER_INVITE ]->(user:User {email: {email} }) WHERE invite.uuid = {invite_uuid}

      MERGE (user)-[leadership:LEADER]->(team)
        ON CREATE SET user.first_name = {first_name}, user.last_name = {last_name}, user.password = {password}

      RETURN user
        `, {}, obj)
             .getResult('user')

  }


  static approveServiceOld(obj){
    return db.query(`

      MATCH (leader:User {uuid: {leader_uuid} })

      MATCH (service:ServiceLogEntry {uuid: {service_uuid} })


      MERGE (leader)-[:APPROVED]->(service)

      RETURN service`, {}, obj).getResults('service');


  }

}

module.exports = leader;
