const volunteer = require('../models/volunteer.js');
const user = require('../models/user.js');
const team = require('../models/team.js');




let vol = {email: "wilson@asdfadfasdf.org", first_name: "wilson",
          last_name: "hubertson",
           file_upload_path: '/tmp/headshot.jpg',
           short_name: 'mmm'
         };




user.validate(vol)
    .then(volunteer.validate)
    .then(volunteer.addToDatabase)
    .then(user.uploadAvatar)
    .then(user.addHeadshotImageToDatabase)

    .then(function(e){
        console.log("successful team volunteer add " + JSON.stringify(e));
    })
    .catch(function(err){
        console.log("failed volunteer test " + err);
    });
