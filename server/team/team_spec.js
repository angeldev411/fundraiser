'use strict';
const team = require('./model.js');


// test team stuff

let t = {
    name: "ToysForTots",
    short_name: "t4t",
    short_description: "lets get toys",
    long_description: "lets get awesome toys",
    creator_uuid: "abcde12345"
};



let result = team.validate(t)
    .then(team.insertIntoDb)
    .then(function(obj){
        console.log("success " + JSON.stringify(obj));
    })
    .catch(function(msg){
        console.log("error " + msg);
    });


let my_team = team.findByShortName("t4t");

console.log(JSON.stringify(my_team));
