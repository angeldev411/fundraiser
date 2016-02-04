const project = require('../models/project.js');


// create project, etc. then test it.

let p = {
    name: "ToysForTots",
    short_name: "t4t",
    short_description: "lets get toys",
    long_description: "lets get awesome toys",
    creator_uuid: "abcde12345"
};

let result = project.validate(p)
    .then(project.validateUniqueName)
    .then(project.insertIntoDb)
    .then(function(obj){
        console.log("success " + JSON.stringify(obj));
    })
    .catch(function(msg){
        console.log("error " + msg);
    });
