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

                RETUsRN user, donation



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
