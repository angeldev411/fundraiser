/* @flow */

import schema from 'validate';
import sha256 from 'js-sha256';

import config from '../config';
var db = require('neo4j-simple')(config.DB_URL)


var login_schema = schema({
  email: {},
  password: {},
  uuid: {}
});


class login {

  static validate(creds){
    var errs = login_schema.validate(creds);
    if(errs.length === 0){
      return Promise.resolve(creds);
    }else{
      return Promise.reject(errs);
    }

  }

  static checkCredentials(creds){
    // TODO: swap password with hashed password
    return db.query(`
                      MATCH (user:User {email: {email}, password: {password} })
                      RETURN user
            `, {}, creds)
             .getResults('user')
             .then(function(result){
               if(result.length > 0){
                 return Promise.resolve(result[0].uuid);
               }else{
                 console.log("trying to validate credentials, no matching user found for " + JSON.stringify(creds));
                 return Promise.reject("invalid username or password");
               }
             })
  }


}

module.exports = login
