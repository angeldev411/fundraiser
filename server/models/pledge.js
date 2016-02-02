/* @flow */

import schema from 'validate';
import stripelib from 'stripe';
import uuid from 'uuid';

var stripe = stripelib("sk_test_WNYEwSIelo8oPutqjz22lzqQ");

import config from '../config';
var db = require('neo4j-simple')(config.DB_URL)

var pledge_schema = schema({
  first_name: {
    type: 'string',
    message: "A first name is required",
    match: /.{2,50}/
  },
  last_name: {
    message: "A last name is required",
    required: true
  },
  payment_card_token: {
   type: 'string'
  },
  team_short_name: {
    type: 'string',
    required: true
  },
  email: {
    type: 'string',
    required: true
  },
  amount_per_hour: {
    required: true,
    type: 'number'
  },
  max_per_month: {
    message: "Maximum per month must be a number",
    type: 'number'
  },
  volunteer_uuid: {}
});

/*
   A pledge is a committment to make a donation based on the hours volunteered by
   one of the volunteers (or for the whole team).
 */
class pledge {

  static create(obj){
    return pledge.validate(obj)
                 .then(pledge.insertIntoDb)

      //.then(pledge.capturePayment)
      //.then(pledge.savePaymentDetails)

  }

  static validate(obj){
    var errs = pledge_schema.validate(obj);

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
      obj.uuid = uuid.v4()
    }

    console.log("input to pledge.insertIntoDb");


    return db.query(`
                     MATCH (team:Team {short_name: {team_short_name} })
                     MERGE (user:User {email: {email} })
                       ON CREATE SET user.uuid = {uuid}, user.first_name = {first_name}, user.last_name = {last_name}

                     WITH team, user

                       MATCH (raisers) WHERE raisers.uuid IN [team.uuid, {volunteer_uuid}]

                         CREATE (pledge:Pledge {amount_per_hour: {amount_per_hour}, max_per_month: {max_per_month} })
                         CREATE (user)-[:PLEDGED]->(pledge)
                         CREATE (raisers)-[:RAISED]->(pledge)

                     RETURN  pledge
         `, {}, obj)
             .getResults('pledge');
  }

}

module.exports = pledge;
