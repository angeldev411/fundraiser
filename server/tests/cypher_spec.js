import neo4j from 'neo4j';
const db = new neo4j.GraphDatabase('http://localhost:7474');


var cb = (result)=> {

};

var result = db.cypher({
    query: `

    MATCH (team:Team {short_name: 'mmm'})
    RETURN team

    `,
    params: {}

}, cb);

console.log(result);