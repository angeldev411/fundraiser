'use strict';
import donation from './donation.js';

console.log(JSON.stringify(donation));

let o = {
    name: "matt",
    email: "mmmurf3@gmail.com",
    team_slug: "stj",
    recipient_uuid: null,
    amount: 5.0,
    max: 55.0
};

let result = donation.validate(o)
    .then(donation.validateUniqueEmail)
    .then(donation.createStripeProfile)
    .then(donation.insertIntoDb)
    .catch((err) => {
        console.log("problem " + JSON.stringify(err));
    })
    .then((obj)=> {
        console.log(JSON.stringify(obj));
        console.log("over");
    });
    'use strict';
    var db = require('neo4j-simple')("http://neo4j:neo5j@localhost:7474");



    function test(){
    var obj = {team_short_name: 'mmm', new_uuid: '01010111', recipient_uuid: '01010222', amount: 33, max: 100, email: 'wilson@aol.com'};

    return db.query(`
        MATCH (team:Team {short_name: {team_short_name} })
        MERGE (user:User {email: {email} })
                    ON CREATE SET user.uuid = {new_uuid}
                    WITH user

                    OPTIONAL MATCH (recipient:User {uuid: {recipient_uuid} })

                    CREATE (donation:Donation {amount: {amount}, max: {max} })

                    CREATE (user)-[:CREATED]->(donation)
                    CREATE (user)-[:SUPPORTED]->(team)

                    //CREATE (user)-[:SUPPORTED]->(recipient)

                    RETURN user, donation
    `
    , {}, obj)
      .getResults('donation', 'user')
    /*
             .then(function (results) {
        console.log("results:")
          console.log(results);
        return Promise.resolve()
      })
      .catch(function(err){
        console.log("error");
        console.log(err);
        return Promise.reject(err)
      })
    */
        };

      Promise.resolve()
             .then(test)
             .then(function(r){
               console.log("as promised: ");
               console.log(r);
             })
             .catch(function(e){
               console.log("errored!");
               console.log(e);
             })
