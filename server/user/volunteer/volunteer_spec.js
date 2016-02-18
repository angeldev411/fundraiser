'use strict';
import volunteer from './model.js';
import user from '../model.js';
import team from '../../team/model.js';

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
