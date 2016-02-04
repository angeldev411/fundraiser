'use strict';
const readline = require('readline');

const config = require('../config');
var db = require('neo4j-simple')(config.DB_URL);


const user = require('../models/user.js');
const company = require('../models/company.js');
const corporate = require('../models/corporate.js');
const team = require('../models/team.js');
const leader = require('../models/leader.js');
const volunteer = require('../models/volunteer.js');
const project = require('../models/project.js');
const donation = require('../models/donation.js');
const pledge = require('../models/pledge.js');
const util = require('../models/util.js');
const helpers = require('./helpers.js');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class setup{


  static wipeDb(){
     return db.query(`MATCH (n)
                      OPTIONAL MATCH (n)-[r]-()
                      DELETE n,r`)
             .getResults('donation', 'user')
  }

  static addInitialUsers(){

    var u = {
      email: 'mmmurf@gmail.com',
      password: 'testtesttest',
      first_name: 'matt',
      last_name: 'murphy',
      uuid: 'abcd1234'};

    return user.validate(u).then(user.insertIntoDb)
  }

  static addCompany(){
    var raiserve = {
      name: "Raiserve",
      short_name: 'raiserve',
      uuid: 'ghighi'
    }

    return company.create(raiserve)
                  .then(function(resp){
                    console.log("company returned");
                    console.log(resp);
                  })

  }

  static assignSuperAdmins(){
    company.assignSuperAdmin({company_uuid: 'ghighi', user_uuid: 'abcd1234'})
  }

  static addProjects(){

    var t4t = {
      name: "Toys for Tots",
      short_name: "t4t",
      short_description: "bring toys to the tots",
      long_description: "toys for tots is an amazing program",
      creator_uuid: 'abcd1234',
      uuid: '543234',
      splash_image_data: helpers.fixtures.splashImage('t4t'),
    };

    var buildon = {
      name: "Buildon",
      short_name: "bo",
      short_description: "build schools for your dollars",
      long_description: "this is one of the most innovative programs",
      creator_uuid: 'abcd1234',
      uuid: '565656',
      splash_image_data: helpers.fixtures.splashImage('buildon'),
    };


    return Promise.all([
      corporate.createProject(t4t),
      corporate.createProject(buildon)])

  }

  static addTeams(){

    var sjbo = {
      name: "St. John's BuildOn",
      short_name: "sjbo",
      short_description: "build schools for your dollars",
      long_description: 'custom long desc?',
      creator_uuid: 'abcd1234',
      leader_uuid: 'abcd1234', // this is matt
      project_uuid: '565656',
      logo_image_data: helpers.fixtures.logo('sjbo'),

    }
    return corporate.createTeam(sjbo)
  }

  static addVolunteers(){
    var vols = [
      {first_name: 'Wilson', last_name: 'Chen', email: 'wchen@aol.com', password: 'wilson', team_short_name: 'sjbo',
       headshot_data: helpers.fixtures.headshot('hs1'), uuid: '12341234',
       bio: 'Born on the west coast. Going to school on the east coast',
       project_statement: 'Buildon means a lot to me because they bring schools'},

      {first_name: 'Kathy', last_name: 'Simmons', email: 'ksim@aol.com', password: 'wilson', team_short_name: 'sjbo',
       headshot_data: helpers.fixtures.headshot('hs1'), uuid: '123123', bio: '', project_statement: ''},

      {first_name: 'Henry', last_name: 'Stevens', email: 'hst@aol.com', password: 'wilson', team_short_name: 'sjbo',
       headshot_data: helpers.fixtures.headshot('hs1'), bio: '', project_statement: ''},

      {first_name: 'Owen', last_name: 'Stein', email: 'oste@aol.com', password: 'wilson', team_short_name: 'sjbo',
       headshot_data: helpers.fixtures.headshot('hs1'), bio: '', project_statement: ''},

      {first_name: 'Jules', last_name: 'Shen', email: 'jshe@aol.com', password: 'wilson', team_short_name: 'sjbo',
       headshot_data: helpers.fixtures.headshot('hs1'), bio: '', project_statement: ''},

      {first_name: 'Kendra', last_name: 'Li', email: 'kli@aol.com', password: 'wilson', team_short_name: 'sjbo',
       headshot_data: helpers.fixtures.headshot('hs1'), bio: '', project_statement: ''},

      {first_name: 'Neha', last_name: 'Gartner', email: 'ng@aol.com', password: 'wilson', team_short_name: 'sjbo',
       headshot_data: helpers.fixtures.headshot('hs1'), uuid: '121212', bio: '', project_statement: ''},

      {first_name: 'Valerie', last_name: 'Brisby', email: 'vbrisb@aol.com', password: 'wilson',team_short_name: 'sjbo',
       headshot_data: helpers.fixtures.headshot('hs1'), bio: '', project_statement: ''},
    ];



    return Promise.all(vols.map( function(v){
      return volunteer.create(v)
    }))


  }

  /*
     these donor data may not be complete for the needed semanatics.
      - donation is always the total amount either entered or derived from pledges
      - a donation was either raised by an individual or by a team.

  */
  static addSimpleDonations(){
    var donors = [
      {first_name: "Jim", last_name: "Doughrety", email: 'jd@aol.com', amount: 55.0,
       stripe_token: "abc", team_short_name: 'sjbo', volunteer_uuid: '12341234'},

      {first_name: "Helen", last_name: "Nye", email: "hneye@aol.com", amount: 10,
       stripe_token: "def", team_short_name: 'sjbo'}
    ];

    return Promise.all(donors.map(function(d){
      return donation.validate(d)
              .then(donation.insertIntoDb)
              //.then(donation.capturePayment)
              //.then(donation.savePaymentDetails)
    }));

  }

  static addPledges(){
    var pledges = [
      {first_name: "Renee", last_name: "Raeburn", email: "rr@aol.com", amount_per_hour: 10,
       max_per_month: 100, volunteer_uuid: null, team_short_name: 'sjbo'},

      {first_name: "Dennis", last_name: "Lord", email: "dlord@aol.com", amount_per_hour: 1,
       max_per_month: 1000, volunteer_uuid: null, team_short_name: 'sjbo'},

      {first_name: "Jacob", last_name: "Lawler", email: "jl@aol.com", amount_per_hour: 2.15,
       max_per_month: 500, volunteer_uuid: '123123', team_short_name: 'sjbo'},

      {first_name: "Dani", last_name: "Boehle", email: "db@aol.com", amount_per_hour: 1.10,
       max_per_month: 500, volunteer_uuid: '123123', team_short_name: 'sjbo'},

      {first_name: "Frank", last_name: "Boehle", email: "fb@aol.com", amount_per_hour: 3,
       max_per_month: 700, volunteer_uuid: '123123', team_short_name: 'sjbo'}
    ];

    return Promise.all(pledges.map(function(p){
      return pledge.create(p)
    }));
  }

  static addLoggedService(){
    var vols = [
      {user_uuid: '12341234', hours: 1.0, signature_data: helpers.fixtures.signature('sig1'),
       team_short_name: 'sjbo', uuid: 'svc10101', place: 'Day Camp', date: new Date(), supervisor_name: 'Robin Brenner'},

      {user_uuid: '12341234', hours: 3.0, signature_data: helpers.fixtures.signature('sig1'),
       team_short_name: 'sjbo', place: 'Wycroft School After School', date: new Date(), supervisor_name: 'Dawn V'},

      {user_uuid: '121212', hours: 5.0, signature_data: helpers.fixtures.signature('sig1'),
       team_short_name: 'sjbo', uuid: 'svc10102',  place: '49th Street Soup Kitchen', date: new Date(), supervisor_name: 'Tiger Hsu'}
    ]


    return Promise.all(vols.map(function(v){
      return volunteer.logService(v);
    }));
  }

  static addServiceApprovals(){
    var leader_uuid = 'abcd1234';

    var approvals = [
      {leader_uuid: 'abcd1234', service_uuid: 'svc10101', signature_data: helpers.fixtures.signature('sig1')},
      {leader_uuid: 'abcd1234', service_uuid: 'svc10102', signature_data: helpers.fixtures.signature('sig1')}
    ]

    return Promise.all(approvals.map(function(a){
      leader.approveService(a);
    }))


  }

  static addPaymentCaptures(){

  }
}




console.log("Seting up Dev Db");

rl.question("Are you sure you want to wipe and regenerate the development DB? (yes/[no])", function(answer) {
  if(answer == 'yes'){
    console.log("YOU SAID YES");


    Promise.resolve()
           .then(setup.wipeDb)
           .then(setup.addCompany)
           .then(setup.addInitialUsers)
           .then(setup.assignSuperAdmins)
           .then(setup.addProjects)
           .then(setup.addTeams)

           .then(setup.addVolunteers)
           .then(setup.addSimpleDonations)
           .then(setup.addPledges)
           .then(setup.addLoggedService)
           .then(setup.addServiceApprovals)
           .catch(function(err){
             console.log("Error in setup: " + err + " stack is " + err.stack);
           })


  }else{
    console.log('You did not say yes, stopping.');
  }
  rl.close();
});
