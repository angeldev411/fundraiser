'use strict';
import neo4jDB from 'neo4j-simple';
import config from '../../config';
import { SPONSOR } from '../roles';
import userController from '../controller';
import Volunteer from '../volunteer/model';
import Team from '../../team/model';
import stripelib from 'stripe';
import uuid from 'uuid';
import Mailer from '../../helpers/mailer';
import Mailchimp from '../../helpers/mailchimp';
import _ from 'lodash';

const stripe = stripelib(config.STRIPE_TOKEN);
const db = neo4jDB(config.DB_URL);

import User from '../model';

export default class Sponsor {
  constructor(data, pledge, teamSlug = null, volunteerSlug = null, stripeToken) {
    let sponsor;

    return this.getSponsorByEmail(data.email)
        .then((existingSponsor) => { // Sponsor already exist
          return new Promise((resolve, reject) => {
            Sponsor.updateStripeCustomer(stripeToken, existingSponsor.stripeCustomerId)
                .then((customer) => {
                    // If stripe customer updated succesfully
                    // Link sponsor
                  return this.linkSponsorToSupportedNode(existingSponsor, pledge, teamSlug, volunteerSlug)
                    .then(() => {
                        // If it's a one time pledge, charge customer right now
                      if (pledge.amount) {
                        return Sponsor.chargeSponsor(existingSponsor.stripeCustomerId, pledge.amount)
                            .then((charged) => {
                                // Update raised attributes on Volunteer and Team.
                              Sponsor.updateRaisedAttributesBySlug(volunteerSlug, teamSlug, pledge.amount)
                                .then(() => {
                                  return resolve(existingSponsor);
                                })
                                .catch((dbError) => {
                                  return reject(dbError);
                                });
                            })
                            .catch(() => {
                              return resolve(existingSponsor);
                            });
                      } else {
                        return resolve(existingSponsor);
                      }
                    })
                    .catch((linkError) => {
                      console.log('Sponsor error:', linkError);
                      reject('Sorry, an internal server error occured');
                    });
                })
                .catch((stripeError) => {
                  console.log('Stripe error', stripeError);
                  return reject(stripeError.message);
                });
          });
        })
        .catch((err) => { // New Sponsor
          return new Promise((resolve, reject) => {
            if (err.message === 'not-already-there') {
              Sponsor.createStripeCustomer(data.email, stripeToken)
                    .then((customer) => {
                        // If customer created succesfully

                        // Add customer ID to data
                      data = {
                        ...(data),
                        stripeCustomerId: customer.id
                      };

                        // Create user
                      return new User(data, SPONSOR)
                        .then((sponsorCreated) => {
                          sponsor = sponsorCreated;

                            // Add user to mailchimp
                          Mailchimp.subscribeSponsor(sponsor);

                            // Link sponsor
                          return this.linkSponsorToSupportedNode(sponsor, pledge, teamSlug, volunteerSlug)
                            .then(() => {
                                // If it's a one time pledge, charge customer right now
                              if (pledge.amount) {
                                return Sponsor.chargeSponsor(sponsor.stripeCustomerId, pledge.amount)
                                    .then((charged) => {
                                        // Update raised attributes on Volunteer and Team.
                                      return Sponsor.updateRaisedAttributesBySlug(volunteerSlug, teamSlug, pledge.amount)
                                        .then(() => {
                                          return resolve(sponsor);
                                        })
                                        .catch((dbError) => {
                                          return reject(dbError);
                                        });
                                    })
                                    .catch(() => {
                                      return resolve(sponsor);
                                    });
                              } else {
                                return resolve(sponsor);
                              }
                            })
                            .catch((linkError) => {
                              console.log('Link sponsor error:', linkError);
                              reject('Sorry, an internal server error occured');
                            });
                        })
                        .catch((sponsorError) => {
                          console.log('Sponsor error', sponsorError);
                          reject('Sorry, an internal server error occured. Are you already registered with this email address?');
                        });
                    })
                    .catch((stripeError) => {
                      console.log('Stripe error', stripeError);
                      reject(stripeError.message);
                    });
            } else {
              reject(err);
            }
          });
        });
  }

  getSponsorByEmail(userEmail) {
    return db.query(`
            MATCH (user:SPONSOR {email: {userEmail} })
            RETURN user
            `,
            {},
      {
        userEmail
      }
        ).getResult('user')
        .catch((err) => {
          throw new Error('not-already-there');
        });
  }

  static getSponsors(projectSlug = null, teamSlug = null, volunteerSlug = null) {
    let query1;

    if (projectSlug && !teamSlug) {
      query1 = () => {
        return db.query(`
                        MATCH (users:SPONSOR)-[rel]->(sponsored)-[*]->(:PROJECT { slug: {projectSlug}})
                        RETURN DISTINCT users
                    `,
                    {},
          {
            projectSlug
          }
                ).getResults('users');
      };
    } else if (teamSlug && !volunteerSlug) {
      query1 = () => {
        return db.query(`
                        MATCH (users:SPONSOR)-[*]->(:TEAM { slug: {teamSlug}})
                        RETURN DISTINCT users
                    `,
                    {},
          {
            teamSlug
          }
                ).getResults('users')
                .then((results1) => {
                  const exclude = [];

                  for (let i = 0; i < results1.length; i++) {
                    exclude.push(results1[i].id);
                  }

                  return db.query(`
                        MATCH (users:SPONSOR)-[rel]->(:VOLUNTEER)-->(:TEAM { slug: {teamSlug}})
                        WHERE NOT(users.id IN {exclude})
                        RETURN DISTINCT users
                        `,
                        {},
                    {
                      teamSlug,
                      exclude
                    }
                    ).getResults('users')
                    .then((results2) => {
                      return Promise.resolve([
                        ...results1,
                        ...results2
                      ]);
                    });
                });
      };
    } else if (volunteerSlug) {
      query1 = () => {
        return db.query(`
                        MATCH (users:SPONSOR)-[rel]->(:VOLUNTEER { slug: {volunteerSlug}})
                        RETURN DISTINCT users
                    `,
                    {},
          {
            volunteerSlug
          }
                ).getResults('users');
      };
    } else {
      query1 = () => {
        return db.query(`
                    MATCH (users:SPONSOR)
                    RETURN DISTINCT users
                `)
                .getResults('users');
      };
    }

    return query1()
        .then((users) => {
          return new Promise((resolve, reject) => {
            users = userController.safeArray(users);
            let numberOfUsersTreated = 0;

            for (let i = 0; i < users.length; i++) {
              let query2;
              const userId = users[i].id;

              users[i].pledges = [];

              if (projectSlug && !teamSlug) {
                query2 = () => {
                  return db.query(`
                                MATCH (user:SPONSOR {id: {userId}})-[support:SUPPORTING|CANCELED_PLEDGE|DONATED]->(sponsored)-[*]->(:PROJECT { slug: {projectSlug}})
                                RETURN {support: support, sponsored: sponsored} AS pledges
                                `,
                                {},
                    {
                      userId,
                      projectSlug
                    }
                            ).getResults('pledges');
                };
              } else if (teamSlug && !volunteerSlug) {
                query2 = () => {
                  return db.query(`
                                MATCH (user:SPONSOR {id: {userId}})-[support:SUPPORTING|CANCELED_PLEDGE|DONATED]->(team:TEAM { slug: {teamSlug}})
                                RETURN {support: support, sponsored: team} AS pledges
                                `,
                                {},
                    {
                      userId,
                      teamSlug
                    }
                            ).getResults('pledges')
                            .then((results1) => {
                              return db.query(`
                                    MATCH (user:SPONSOR {id: {userId}})-[support:SUPPORTING|CANCELED_PLEDGE|DONATED]->(volunteer)-->(team:TEAM { slug: {teamSlug}})
                                    RETURN {support: support, sponsored: volunteer} AS pledges
                                    `,
                                    {},
                                {
                                  userId,
                                  teamSlug
                                }
                                ).getResults('pledges')
                                .then((results2) => {
                                  return Promise.resolve([
                                    ...results1,
                                    ...results2
                                  ]);
                                });
                            });
                };
              } else if (volunteerSlug) {
                query2 = () => {
                  return db.query(`
                                MATCH (user:SPONSOR {id: {userId}})-[support:SUPPORTING|CANCELED_PLEDGE|DONATED]->(volunteer:VOLUNTEER { slug: {volunteerSlug}})
                                RETURN {support: support, sponsored: volunteer} AS pledges
                                `,
                                {},
                    {
                      userId,
                      volunteerSlug
                    }
                            ).getResults('pledges');
                };
              } else {
                query2 = () => {
                  return db.query(`
                                MATCH (user:SPONSOR {id: {userId}})-[support:SUPPORTING|CANCELED_PLEDGE|DONATED]->(sponsored)
                                RETURN {support: support, sponsored:sponsored} AS pledges
                                `,
                                {},
                    {
                      userId
                    }
                            ).getResults('pledges');
                };
              }

              query2()
                    .then((pledges) => {
                      numberOfUsersTreated++;

                      for (let j = 0; j < pledges.length; j++) {
                        const currentPledge = {
                          support: pledges[j].support,
                          sponsored: pledges[j].sponsored.name ? pledges[j].sponsored : userController.safe(pledges[j].sponsored)
                        };

                        users[i].pledges.push(currentPledge);
                      }


                      if (numberOfUsersTreated === users.length) {
                        return resolve(users);
                      }
                    })
                    .catch((err) => {
                      return reject(err);
                    });
            }
          });
        })
        .catch((err) => {
          return Promise.reject(err);
        });
  }

    /*
     * linkSponsorToSupportedNode()
     * Link sponsor to the supported volunteer or team and update team/volunteer attributes
     *
     * sponsor: sponsor object
     * pledge: pledge object
     * teamSlug
     * volunteerSlug
    */
  linkSponsorToSupportedNode(sponsor, pledge, teamSlug = null, volunteerSlug = null) {
    const token = uuid.v4();

    if (teamSlug) { // Sponsoring a team
      let team;

          // Build appropriate query for one-time or hourly sponsorship
          // we will create a SUPPORTING or DONATED relationship between user and
          // team, then return the team for use in notifications.
      let query = `MATCH (user:SPONSOR {id: {userId} }), (team:TEAM {slug: {teamSlug} })
          SET team.totalSponsors = team.totalSponsors + 1 `;
      query += pledge.hourly ?
            `CREATE (user)-[:SUPPORTING {hourly: {hourly}, total: {total}, hoursCharged: {hoursCharged}, date: {date}, token: {token}, maxCap: {maxCap}}]->(team) `
            :
            `CREATE (user)-[:DONATED {amount: {amount}, total: {total}, date: {date}}]->(team) `;
      query += 'RETURN { team: team } as result';

          // all possible options. Depending on sponsorship, some will not be used
          console.log('hourly pledge', pledge.hourly);
      let queryOptions = {
        teamSlug,
        userId:   sponsor.id,
        hourly:   pledge.hourly,
        maxCap:   pledge.maxCap,
        amount:   pledge.amount,
        total:    0,
        hoursCharged: 0,
        date:     new Date(),
        token
      };

      return db.query( query, queryOptions)
          .getResult('result')
          .then( (result) => { // store team from result, look up the project
            team = result.team;
            return Team.getProject(team);
          })
          .then( (project) => { // add project to team, send thank-yous
            team.project = project;

            if (pledge.hourly)
              Mailer.sendThanksToHourlyTeamSponsor(team, sponsor, pledge.hourly);
            else
              Mailer.sendThanksToOneTimeTeamSponsor(team, sponsor, pledge.amount);
          })
          .catch((err) => {
            console.log('Error in linkSponsorToSupportedNode for team:',err);
            return Promise.reject(err);
          });


    } else if (volunteerSlug) { // Sponsoring a volunteer

      if (pledge.hourly) {
        return db.query(`
                    MATCH (user:SPONSOR {id: {userId} }), (volunteer:VOLUNTEER {slug: {volunteerSlug} })
                    SET volunteer.hourlyPledge = volunteer.hourlyPledge + {hourly}, volunteer.totalSponsors = volunteer.totalSponsors + 1
                    CREATE (user)-[supporting:SUPPORTING {hourly: {hourly}, total: {total}, date: {date}, token: {token}, maxCap: {maxCap}}]->(volunteer)
                    RETURN {volunteer: volunteer, supporting: supporting} AS result
                    `,
                    {},
          {
            userId: sponsor.id,
            volunteerSlug,
            hourly: Number(pledge.hourly).toFixed(2),
            total: 0,
            date: new Date(),
            token,
            maxCap: pledge.maxCap
          }
                )
                .getResult('result')
                .then((result) => {
                  return Sponsor.sendSponsorshipEmails(result.volunteer, sponsor, pledge.hourly, true, result.supporting)
                    .then(() => {
                      return Promise.resolve();
                    })
                    .catch((err) => {
                      console.log(err);
                      return Promise.reject();
                    });
                });
      } else if (pledge.amount) {
        return db.query(`
                    MATCH (user:SPONSOR {id: {userId} }), (volunteer:VOLUNTEER {slug: {volunteerSlug} })
                    SET volunteer.totalSponsors = volunteer.totalSponsors + 1
                    CREATE (user)-[:DONATED {amount: {amount}, total: {total}, date: {date}}]->(volunteer)
                    RETURN volunteer
                    `,
                    {},
          {
            userId: sponsor.id,
            volunteerSlug,
            amount: pledge.amount,
            total: 0,
            date: new Date()
          }
                )
                .getResult('volunteer')
                .then((volunteer) => {
                  return Sponsor.sendSponsorshipEmails(volunteer, sponsor, pledge.amount)
                    .then(() => {
                      return Promise.resolve();
                    })
                    .catch((err) => {
                      console.log(err);
                      return Promise.reject();
                    });
                });
      }
    }
  }

  static sendSponsorshipEmails(volunteer, sponsor, amount, hourly = false, supporting = null) {
    return Volunteer.getTeamAndProject(volunteer)
        .then((result) => {
          volunteer = {
            ...volunteer,
            project: result.project,
            team: result.team
          };

          if (hourly) {
            return Promise.all([
              Mailer.sendVolunteerSponsorshipEmail(volunteer, sponsor),
              Mailer.sendSponsorSponsorshipThanksEmail(volunteer, sponsor, amount)
            ])
                .then(() => {
                  return Promise.resolve();
                })
                .catch((err) => {
                  return Promise.reject(err);
                });
          } else {
            return Promise.all([
              Mailer.sendSponsorDonationThanksEmail(volunteer, sponsor, amount)
            ])
                .then(() => {
                  return Promise.resolve();
                })
                .catch((err) => {
                  return Promise.reject(err);
                });
          }
        });
  }

    // ---- BILLING FUNCTIONS ----

    /*
     * createStripeCustomer()
     * Create a customer on stripe
     *
     * email: sponsor email
     * stripeToken: stripe token retrieved with stripe.js
    */
  static createStripeCustomer(email, stripeToken) {
    return new Promise((resolve, reject) => {
      stripe.customers.create({
        email,
        source: stripeToken
      }, (err, customer) => {
        if (customer) {
          resolve(customer);
        } else if (err) {
          console.log('Stripe error:', err.message);
          reject(err.message);
        }
      });
    });
  }

    /*
     * updateStripeCustomer()
     * Update a customer on stripe
     *
     * stripeToken: stripe token retrieved with stripe.js
     * customerId: stripe customerId to update
    */
  static updateStripeCustomer(stripeToken, customerId) {
    return new Promise((resolve, reject) => {
      stripe.customers.update(customerId, {
        source: stripeToken
      }, (err, customer) => {
        if (customer) {
          resolve(customer);
        } else if (err) {
          console.log('Stripe error:', err.message);
          reject(err.message);
        }
      });
    });
  }


  static getTeamSponsors(){
    return db.query(`
      MATCH (sponsor:SPONSOR)-[supporting:SUPPORTING]->(team:TEAM)-[]->(project)
      WITH sponsor, {
       projectName:  project.name,

       teamId:        team.id,
       teamName:      team.name,
       goal:          team.goal,
       currentHours:  team.currentHours,
       totalHours:    team.totalHours,

       hourly:        supporting.hourly,
       maxCap:        supporting.maxCap,
       hoursCharged:  supporting.hoursCharged,
       total:         supporting.total
     } as supporting
      RETURN {
        sponsor: sponsor,
        supportings: collect(supporting)
      } as result
    `)
    .getResults('result');
  }

  static getVolunteerSponsors(){
    return db.query(`
      MATCH (sponsor:SPONSOR)-[supporting:SUPPORTING]->(volunteer:VOLUNTEER)-[]->(team:TEAM)-[]->(project:PROJECT)
      WITH sponsor, {
       projectName:  project.name,

       teamId:        team.id,
       teamName:      team.name,
       goal:          team.goal,
       currentHours:  team.currentHours,
       totalHours:    team.totalHours,

       volunteerId:   volunteer.id,
       volunteer:     volunteer.firstName + " " + volunteer.lastName + " <" + volunteer.email + ">",

       hourly:        supporting.hourly,
       maxCap:        supporting.maxCap,
       hoursCharged:  supporting.hoursCharged,
       total:         supporting.total
     } as supporting
      RETURN {
        sponsor: sponsor,
        supportings: collect(supporting)
      } as result
    `)
    .getResults('result');
  }


  /*
   * Accepts an array of sponsor/supportings hashes.
   * Returns an array of Promises for charging and updating the sponsors.
   *
   * sponsors - Array of objects containing a sponsor and the teams/volunteers
   * they support
   */
  static chargeSponsors( sponsors ){
    let minCharge = 1; // $1

    let charges = _.reduce( sponsors, (charges, result) => {
      const sponsor     = result.sponsor;
      const supportings = result.supportings;
      console.log(`Charging ${sponsor.email}...`);

      const sponsorCharges = _.map( supportings, (support) => {

        const billableHours = (Math.min( support.totalHours, support.goal )
                        - (support.hoursCharged || 0)).toFixed(2);

        // calculate charge, convert to cents, careful of type/rounding errors
        support.hourly    = Number(support.hourly).toFixed(2);
        let chargeAmount  = (billableHours * support.hourly).toFixed(2);

        if( chargeAmount < minCharge ) return;

        const teamOrVol = !!support.volunteer ? 'volunteer' : 'team';
        console.log(` ${teamOrVol} hourly support of $${chargeAmount} (${billableHours} hours * $${support.hourly} hourly) for team ${support.teamName}`);

        const meta = {
          team:         support.teamName,
          project:      support.projectName,
          hoursBilled:  billableHours,
          hourlyPledge: support.hourly
        }
        if(support.volunteer) meta.volunteer = support.volunteer;

        return Sponsor.chargeSponsor(sponsor.stripeCustomerId, chargeAmount, meta)
        .then(() => Sponsor.updateSupport(sponsor, support, billableHours, chargeAmount) );

      });

      return charges.concat(sponsorCharges);

    }, []);

    charges = _.reject( charges, (charge) => typeof charge === 'undefined' );
    return Promise.all(charges);

  }

  static billSponsors(){
    let sponsors;

    return Sponsor.getTeamSponsors()
    .then( (results) => sponsors = results )
    .then( () => Sponsor.getVolunteerSponsors() )
    .then( (results) => sponsors = sponsors.concat(results) )
    .then( () => Sponsor.chargeSponsors( sponsors ) )
    .catch((err) => {
      console.log(err);
      Promise.reject(err);
    });
  }


    /*
     * calculateAmountToBill()
     * Calculate the amount to bill
     *
     * sponsoring: sponsoring contract
     * hoursToBill: number of hours to bill
    */
  static calculateAmountToBill(sponsoring, hoursToBill) {
    const amount = sponsoring.support.hourly * hoursToBill;

    if (amount > sponsoring.support.maxCap) {
            // If the amount to bill is higher than the max cap defined on pledge, bill the max cap
      return sponsoring.support.maxCap;
    } else {
      return amount;
    }
  };

    /*
     * chargeSponsor()
     * Charge amount to stripe customer
     *
     * stripeCustomerId: stripe customer id to charge
     * amount: amount to charge, in cents
    */
  static chargeSponsor(stripeCustomerId, amount, metadata = {}) {
    amount = Math.round(amount * 100);
    return new Promise((resolve, reject) => {
      stripe.charges.create({
        amount,
        currency: 'usd',
        customer: stripeCustomerId,
        metadata
      }, (err, charge) => {
        if (charge) {
          resolve(charge);
        } else if (err) {
          console.log(`Stripe error charging ${amount}:`, err.message);
          reject(err.message);
        }
      });
    });
  };


    /*
     * updateSupportingRelationTotal()
     * Update the total donated on the support contract
     *
     * sponsor: sponsor object
     * amount: amount billed in USD
     * supported: supported object
    */
  static updateSupportingRelationTotal(sponsor, amount, supported){
    return db.query(`
            MATCH (sponsor:SPONSOR {id: {sponsorId} })-[support:SUPPORTING]->(supported {id: {supportedId} })
            SET support.total = support.total + {amount}
            RETURN support
            `,
            {},
      {
        sponsorId: sponsor.id,
        amount,
        supportedId: supported.id
      }
        );
  };

  // Updates the SUPPORTING relationship between a sponsor and a team or
  // volunteer.
  static updateSupport(sponsor, support, newHours, newCharge){
    const sponsorId =   sponsor.id;
    const teamOrVolId = support.volunteerId || support.teamId;
    return db.query(`
      MATCH ({id: {sponsorId}})-[r:SUPPORTING]->({id: {teamOrVolId}})
      SET r.total = toFloat(r.total) + toFloat({newCharge}),
         r.hoursCharged = CASE WHEN EXISTS(r.hoursCharged)
          THEN toFloat(r.hoursCharged) + toFloat({newHours})
          ELSE toFloat({newHours})
         END
    `, {}, {
      sponsorId,
      teamOrVolId,
      newCharge,
      newHours
    });
  }

  /*
   * updateRaisedAttributes()
   * Update raised attribute on a volunteer and totalRaised attribute on related team
   *
   * supported: supported object
   * raised: raised money, so just charged amount
   * forVolunteer: true to process volunteer sponsors, false to process team sponsors
  */
  static updateRaisedAttributes(supported, raised, forVolunteer = true) {
    let data;

    if (forVolunteer) {
      return db.query(`
                MATCH (volunteer {id: {volunteerId} })-[:VOLUNTEER]->(team:TEAM)<-[:LEAD]-(teamLeader:TEAM_LEADER)
                WHERE NOT (teamLeader:FAKE_LEADER) AND (volunteer:VOLUNTEER OR volunteer:VOLUNTEER_DISABLED)
                SET     volunteer.raised = volunteer.raised + {raised},
                        team.totalRaised = team.totalRaised + {raised}
                RETURN {volunteer: volunteer, teamLeader: teamLeader} AS result
                `,
                {},
        {
          volunteerId: supported.id,
          raised: parseInt(raised, 10)
        }
            ).getResult('result')
            .then((result) => {
              data = result;
              return Mailchimp.updateVolunteer(data.volunteer);
            })
            .then(() => {
              return Mailchimp.updateTeamLeader(data.teamLeader);
            })
            .then(() => {
              return Promise.resolve();
            })
            .catch((err) => {
              return Promise.reject(err);
            });
    } else {
      return db.query(`
                MATCH (team:TEAM {id: {teamId} })<-[:LEAD]-(teamLeader:TEAM_LEADER)
                WHERE NOT (teamLeader:FAKE_LEADER)
                SET     team.totalRaised = team.totalRaised + {raised}
                RETURN {team: team, teamLeader: teamLeader} AS result
                `,
                {},
        {
          teamId: supported.id,
          raised: parseInt(raised, 10)
        }
            ).getResult('result')
            .then((result) => {
              data = result;
              return Mailchimp.updateTeamLeader(data.teamLeader);
            })
            .then(() => {
              return Promise.resolve();
            })
            .catch((err) => {
              return Promise.reject(err);
            });
    }
  };

    /*
     * updateRaisedAttributesBySlug()
     * Update raised and totalRaised attributes on a volunteer and related team
     *
     * volunteer: volunteer object
     * raised: raised money, so just charged amount
    */
  static updateRaisedAttributesBySlug(volunteerSlug = null, teamSlug = null, raised){
    let data;

    if (volunteerSlug) {
      return db.query(`
                MATCH (volunteer {slug: {volunteerSlug} })-[:VOLUNTEER]->(team:TEAM)<-[:LEAD]-(teamLeader:TEAM_LEADER)
                WHERE NOT (teamLeader:FAKE_LEADER) AND (volunteer:VOLUNTEER OR volunteer:VOLUNTEER_DISABLED)
                SET     volunteer.raised = volunteer.raised + {raised},
                        team.totalRaised = team.totalRaised + {raised}
                RETURN {volunteer: volunteer, teamLeader: teamLeader} AS result
                `,
                {},
        {
          volunteerSlug,
          raised: parseInt(raised, 10)
        }
            ).getResult('result')
            .then((result) => {
              data = result;
              return Mailchimp.updateVolunteer(data.volunteer);
            })
            .then(() => {
              return Mailchimp.updateTeamLeader(data.teamLeader);
            })
            .then(() => {
              return Promise.resolve();
            })
            .catch(() => {
              return Promise.reject();
            });
    } else if (teamSlug) {
      return db.query(`
                MATCH (team:TEAM {slug: {teamSlug} })<-[:LEAD]-(teamLeader:TEAM_LEADER)
                SET     team.raised = team.raised + {raised}
                RETURN {team: team, teamLeader: teamLeader} AS result
                `,
                {},
        {
          teamSlug,
          raised: parseInt(raised, 10)
        }
            ).getResult('result')
            .then((result) => {
              data = result;
              return Mailchimp.updateTeamLeader(data.teamLeader);
            })
            .then(() => {
              return Promise.resolve();
            })
            .catch(() => {
              return Promise.reject();
            });
    }
  };

    /*
     * getPledge()
     * Get an hourly pledge
     *
     * cancelToken: pledge token
    */
  static getPledge(token) {
    return db.query(`
            MATCH (sponsor:SPONSOR)-[pledge:SUPPORTING {token: {token}}]->(supported)
            RETURN {sponsor: sponsor, pledge: pledge} AS result
            `,
            {},
      {
        token
      }
        ).getResult('result')
        .then((pledge) => {
          return Promise.resolve(pledge);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
  };

    /*
     * cancelPledge()
     * Cancel an hourly pledge
     *
     * cancelToken: pledge token
    */
  static cancelPledge(cancelToken){
    return db.query(`
            MATCH (sponsor:SPONSOR)-[pledge:SUPPORTING {token: {cancelToken}}]->(supported)
            CREATE (sponsor)-[canceledPledge:CANCELED_PLEDGE]->(supported)
            SET canceledPledge = pledge, canceledPledge.cancelDate = {cancelDate}
            WITH pledge, canceledPledge
            DELETE pledge
            RETURN canceledPledge
            `,
            {},
      {
        cancelToken,
        cancelDate: new Date()
      }
        ).getResult('canceledPledge')
        .then((pledge) => {
          return Promise.resolve(pledge);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
  };
}
