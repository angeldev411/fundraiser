/* @flow */

import schema from 'validate';
import stripelib from 'stripe';
import s3 from 's3';
import sha256 from 'js-sha256';
import uuid from 'uuid';

var stripe = stripelib("sk_test_WNYEwSIelo8oPutqjz22lzqQ");

import config from '../config';
var db = require('neo4j-simple')(config.DB_URL);

import util from './util';


var user_schema = schema({
  first_name: {
    type: 'string',
    message: "A first name is required"
  },
  last_name: {
    type: 'string',
    message: "A last name is required"
  },
  email: {
    type: 'string',
    required: true,
    match: /@/,
    message: 'A Valid email must be provided'
  }
}, {
  strip: false
});


class user {

  static assignUuid(obj){
    if(typeof(obj.uuid) == 'undefined'){
      obj.uuid = uuid.v4();
    }
    return Promise.resolve(obj);
  }

  static validate(obj:{[email: string]: string }){
    var errs = user_schema.validate(obj);

    return new Promise((resolve, reject) => {
      if(errs.length === 0){
        resolve(obj);
      }else{
        reject(errs);
      }
    });
  }

  static volunteeringForTeams(uuid){
    return db.query(`
        MATCH (u:User {uuid: {uuid}} )-[:VOLUNTEER]->(t:Team) return t
      `, {}, {uuid: uuid})
             .getResults('t')
  }
  static leadingTeams(uuid){
    return db.query(`
        MATCH (u:User {uuid: {uuid}} )-[:LEADER]->(t:Team) return t
      `, {}, {uuid: uuid})
             .getResults('t')
  }

  static rolesForUuid(uuid){
    if(typeof(uuid) == 'undefined' || uuid == null || uuid.length == 0){
      return Promise.resolve([]) //reject("Must provide uuid")
    }
    return db.query(`
                     MATCH (u:User {uuid: {uuid} })-[r]-(t:Team)
                     RETURN type(r) as type
                     UNION
                     MATCH (u:User {uuid: {uuid}})-[raiserve_roles]->(company:Company {short_name: 'raiserve'})
                     RETURN type(raiserve_roles) as type

                 `, {}, {uuid: uuid})
             .getResults('type')
  }

  /* Returns a hash where the keys are role strings" */
  static roleMapForUuidOld(uuid){
    return db.query(`
                MATCH (user:User {uuid: {uuid} })
                MATCH (user)-[r]->(b) WHERE b:Team or b:Project 
                RETURN {type: head(labels(b)), uuid: b.uuid, relation: type(r)} as mapping

         `, {}, {uuid: uuid})
             .getResults('mapping') // what goes here <--
             .then(function(result){
               var h = {};
               var roles = result.forEach((r) => {
                 var k = `${r.type}_${r.uuid}_${r.relation}`.toLowerCase();
                 h[k] = true;
               });
               console.log("roles from db are");
               console.log(h);
               return Promise.resolve(h);
             })
  }

  static roleMapForUuid(uuid){
    return db.query(`
                MATCH (user:User {uuid: {uuid} })
                MATCH (user)-[r:LEADER|VOLUNTEER|CREATOR|OWNER|SUPER_ADMIN]-(b) WHERE b:Team or b:Project or b:Company
                RETURN {type: head(labels(b)), uuid: b.uuid, name: b.name, short_name: b.short_name,  relation: type(r)} as role_map

         `, {}, {uuid: uuid})
      .getResults('role_map')

  }
  
  static findByUuid(uuid){

    return db.query(`
                     MATCH (user:User {uuid: {uuid} }) RETURN user
         `, {}, {uuid: uuid})
             .getResults('user');
  }

  static findByEmail(email){
    return db.query(`
                     MATCH (user:User {email: {email} }) RETURN user
         `, {}, obj)
             .getResults('user');
  }




  static uploadHeadshotImage(obj: {headshot_data: string}){

    if(typeof(obj.uuid) == 'undefined'){
      obj.uuid = uuid.v4()
    }

    console.log("upload headshot image GOT UUID " + obj.uuid);
    return new Promise( (resolve, reject) => {
      var content_type = util.detectContentType(obj.headshot_data);
      try{

        var sha = sha256(obj.headshot_data);

        obj.headshot_image_key = `images/avatars/${sha}.jpg`;

        console.log('uploading hs image with key ' + obj.headshot_image_key);
        util.uploadToS3(obj.headshot_data, 'raiserve', obj.headshot_image_key, {content_type: content_type}, function(err, data){
          if(err){
            reject("error uploading headshot data " + err);
          }else{
            delete(obj.headshot_data);
            resolve(obj);
          }
        });
      }catch(e){
        reject("upload error: " + e + " " + e.stack);
      }
    });
  };

  static createCardProfile(obj){
    return new Promise((resolve, reject)=> {

      stripe.customers.createCard(
        obj.stripe_customer_id,
        {card: obj.card_token},
        function(err, card) {
          if(err){
            reject(err);
          }else{
            obj.card = card;
            resolve(obj);
          }
        }
      );
    });
  }

  static createCustomerProfile(obj){
    return new Promise((resolve, reject)=> {
      stripe.customers.create(
        {
          email: obj.email
        },
        function(err, customer){
          if(err){
            reject(err);
          }else{
            obj.stripe_customer_id = customer.id;
            resolve(obj);
          }
        });
    });
  }

  static insertIntoDb(obj){
    if(typeof(obj.uuid) == 'undefined'){
      obj.uuid = uuid.v4();
    }
    return db.query(`
      MERGE (user:User {email: {email} })
          ON CREATE SET user.password = {password}, user.uuid = {uuid}, user.first_name = {first_name}, user.last_name = {last_name}
      RETURN user`, {}, obj)
             .getResults('user');
  }

  /* expects obj.uuid and obj.key */
  static addHeadshotImageToDb(obj){

    return db.query(`
                MATCH (user:User {uuid: {uuid} })
                CREATE (img:Image {key: {key} })

                CREATE (user)-[:HEADSHOT]->(img)

                RETURN img
           `, {}, obj)
             .getResults('img');


  }


};

user.validate({email: 'foo'});

module.exports = user;
