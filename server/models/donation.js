import schema from 'validate';
import stripelib from 'stripe';
import uuid from 'uuid';

const stripe = stripelib("sk_test_WNYEwSIelo8oPutqjz22lzqQ");

import config from '../config';
var db = require('neo4j-simple')(config.DB_URL)



const donation_schema = schema({
  first_name: {
    type: 'string',
    message: "A first name is required",
    match: /.{2,50}/
  },
  last_name: {
    type: 'string',
    message: "A last name is required",
    match: /.{2,50}/
  },
  phone: {
    type: 'string',
    message: "A phone number is required",
    match: /.{7,12}/
  },
  address1: {
    type: 'string',
    message: "Street address is required",
    match: /.{7,99}/
  },
  city: {
    type: 'string',
    message: "A city is required",
    match: /.{2,99}/
  },
  state: {
    type: 'string',
    message: "A state is required",
    match: /.{2}/
  },
  zip: {
    type: 'string',
    message: "A zip/postal code is required",
    match: /.{5}/
  },
  email: {
    type: 'string',
    required: true,
    match: /@/,
    message: 'A Valid email must be provided'
  },
  team_short_name: {
    message: "A donation must be associated with a team's short name",
    type: "string",
    match: /.{2,50}/,
    required: true
  },
  recipient_uuid: {
    type: "string",
    match: /.{2,}/
  },
  amount: {
    message: "Please choose an amount greater than zero",
    type: "number",
    use: function(i){
      return (parseInt(i) > 0);
    }
  },
  volunteer_uuid: {
    type: "string"
  },
  max: {
    type: "number"
  }
}, {typecast: true});


class donation {

  static insertIntoDb(obj){

    obj.new_user_uuid = uuid.v4();
    obj.donation_uuid = uuid.v4();

    if(typeof(obj.volunteer_uuid) == 'undefined'){
      obj.volunteer_uuid = '';
    }


    console.log("calling insert donation");

    return db.query(`

                MATCH (team:Team {short_name: {team_short_name} })

                MERGE (user:User {email: {email} })
                  ON CREATE SET user.uuid = {new_user_uuid}

                CREATE (donation:Donation {amount: {amount}, uuid: {donation_uuid}, cleared: false })

                CREATE (user)-[:DONATED]->(donation)

                WITH team, donation

                    // we match on uuid for the Team AND Volunteer
                    MATCH (raisers) WHERE raisers.uuid IN [team.uuid, {volunteer_uuid}]
                    // since we can create relationships on [] we can split this out into two different relationship types.
                    // individual raise vs team raise
                    CREATE (raisers)-[:RAISED]->(donation)


                RETURN donation

             `, {}, obj)
             .getResults('donation');

  }



  static validate(obj){
    const errs = donation_schema.validate(obj);

    return new Promise((resolve, reject) => {
      if(errs.length === 0){
        resolve(obj);
      }else{
        reject(errs);
      }
    });
  }


};


module.exports = donation;
