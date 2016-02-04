/* @flow */

const user = require('../models/user.js');


var matt = {
  first_name: "matt",
  last_name: 'murphy',
  email: "test2@aol.com",
  password: 'password',
};

user.validate(matt)
    .then(function(obj){
      console.log("successful insert " + JSON.stringify(obj));
    }, function(obj){
      console.log('err handler bad bad ' + JSON.stringify(obj));
    })
    .catch(function(err){
      console.log("PROMISE ERRO " + err)
    })


//user.login('test2@aol.com', 'password')
//    .then(function(uuid){
//        console.log("successs with " + uuid);
//    })
//    .catch(function(obj){
//        console.log("failure " + JSON.stringify(obj));
//    });



// user.findByUuid("abcde12345")
//    .then(function(uuid){
//         console.log("successs with " + uuid);
//     })
//     .catch(function(obj){
//         console.log("failure " + JSON.stringify(obj));
//     });

// user.rolesForUuid("abcde12345")
//     .then(function(roles){
//         console.log("Roles are " + JSON.stringify(roles));
//     })
//     .catch(function(err){
//         console.log(JSON.stringify(err));
//     });


// const imager = {uuid: "abcde12345", url: "/path/to/headshot.jpg"};

// // expects obj.uuid and obj.url
// user.addHeadshotImageToDatabase(imager)
//     .then(function(obj){
//         console.log("success " + JSON.stringify(obj));
//     })
//     .catch(function(obj){
//         console.log("err " + JSON.stringify(obj));
//     });
