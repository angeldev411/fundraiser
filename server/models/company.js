import schema from 'validate';
import uuid from 'uuid';

import config from '../config';
var db = require('neo4j-simple')(config.DB_URL)

const company_schema = schema({
  name: {},
  short_name: {},
  uuid: {},
});




class company {


  static create(obj){
    return company.validate(obj)
                  .then(company.insertIntoDb);
  }

  static validate(obj){
    const errs = company_schema.validate(obj);
    return new Promise((resolve, reject) => {
      if(errs.length === 0){
        resolve(obj);
      }else{
        reject(errs);
      }
    });
  }

  static insertIntoDb(obj){
    if(typeof(obj.uuid) == 'undefined'){
      obj.uuid = uuid.v4();
    }
    return db.query(`
      MERGE (company:Company {short_name: {short_name}})
      ON CREATE SET company.uuid = {uuid}

      RETURN company
      `, {}, obj)
             .getResult('company');
  }

  static assignSuperAdmin(obj){
    console.log("assigning super admin from");
    console.log(obj);

    return db.query(`
      MATCH (company:Company {uuid: {company_uuid}})
      MATCH (user:User) WHERE user.uuid = {user_uuid}

      CREATE (user)-[:SUPER_ADMIN]->(company)

      RETURN company
      `, {}, obj)
             .getResult('company');
  }

}

module.exports = company;
