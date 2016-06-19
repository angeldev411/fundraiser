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
            hourly: parseInt(pledge.hourly, 10),
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


  static billSponsors(){
    let minCharge = 100; // $1

      // [
      //   {
      //     id: '76800242-171c-4659-8272-80ffc9265388',
      //     name: 'Team Name',
      //     sponsors: [
      //      {
      //
      //      }
      //     ]
      //   }
      // ]
    console.log('billing!');
    Team.getWithUnbilledHours()
    .then( (teams) => {
      console.log('The teams!',teams);
    });

    return;

    const teamResult = _(teams).each( (team) => {
      console.log('Team:',team);
      _(team.sponsors).each( (sponsor) =>
        sponsor.charge() // charge and update the sponsor's hours charged
      );
    });
    log('teamResult', JSON.Stringify(teamResult));

      // let volunteers  = Volunteers.withUnbilledSponsors();
      //
      // // [{hours: 4}]
      // sponsors.each( (sponsor) => {
      //
      // });

      // for all sponsors
      // tobecharged = (min(sponsor->volunteer.hours, sponsor->volunteer.goal) - sponsor.hourscharged)*sponsor.perhourcharge
      //  if tobecharged > mincharge
      //    chargecreditcard ( tobecharged )
      //    sponsor.hourscharged = volunteeer.hours
  }
    /*
     * billSponsors()
     * MAIN BILLING SCRIPT
     * Get not billed hours and charge sponsors
    */
  static oldBillSponsors() {
    let sponsorsToBill = [];

        // Get all sponsors who hourly support volunteers
    return Sponsor.getSponsorsToBill()
        .then((sponsors) => {
          sponsorsToBill = sponsors;
          return Sponsor.processVolunteerSponsoringContracts(sponsorsToBill);
        })
        .then(() => {
          return Sponsor.processTeamSponsoringContracts(sponsorsToBill);
        })
        .catch((getSponsorError) => {
          Promise.reject(getSponsorError);
        });
  }

    /*
     * getSponsorsToBill()
     * Retrieve sponsors who hourly supports volunteers or team
    */
    // TODO: Only fetch sponsors for active teams
  static getSponsorsToBill() {
    return db.query(`
            MATCH (sponsors:SPONSOR)-[support:SUPPORTING]->(supported)
            RETURN DISTINCT sponsors
        `).getResults('sponsors');
  };

    /*
     * processVolunteerSponsoringContracts()
     * Bill sponsoring contracts on volunteers
     *
     * sponsors: array of sponsors
    */
  static processVolunteerSponsoringContracts(sponsors) {
    const promises = sponsors.map((sponsor) => {
      return Sponsor.getVolunteerSponsoringContracts(sponsor)
            .then(Sponsor.processNotBilledHours)
            .catch((getSponsoringContractsError) => {
              return Promise.reject(getSponsoringContractsError);
            });
    });

    return Promise.all(promises);
  };

    /*
     * getVolunteerSponsoringContracts()
     * Retrieve sponsoring contracts on volunteers, with hourly amount
     *
     * sponsor: sponsor object
    */
  static getVolunteerSponsoringContracts(sponsor) {
    return db.query(`
            MATCH (sponsor:SPONSOR {id: {sponsorId}})-[support:SUPPORTING]->(volunteer)
            WHERE volunteer:VOLUNTEER OR volunteer:VOLUNTEER_DISABLED
            RETURN {sponsor: sponsor, support: support, supported: volunteer} AS sponsorings
            `,
            {},
      {
        sponsorId: sponsor.id
      }
        ).getResults('sponsorings');
  };

    /*
     * processTeamSponsoringContracts()
     * Bill sponsoring contracts on team
     *
     * sponsors: array of sponsors
    */
  static processTeamSponsoringContracts (sponsors) {
        // console.log('processTeamSponsoringContracts');
    const promises = sponsors.map((sponsor) => {
      return Sponsor.getTeamSponsoringContracts(sponsor)
            .then((sponsorings) => {
              return Sponsor.processNotBilledHours(sponsorings, false);
            })
            .catch((getSponsoringContractsError) => {
              return Promise.reject(getSponsoringContractsError);
            });
    });

    return Promise.all(promises);
  };

    /*
     * getTeamSponsoringContracts()
     * Retrieve sponsoring contracts on teams, with hourly amount
     *
     * sponsor: sponsor object
    */
  static getTeamSponsoringContracts (sponsor) {
    return db.query(`
            MATCH (sponsor:SPONSOR {id: {sponsorId}})-[support:SUPPORTING]->(team:TEAM)
            RETURN {sponsor: sponsor, support: support, supported: team} AS sponsoring
            `,
            {},
      {
        sponsorId: sponsor.id
      }
        ).getResults('sponsoring');
  };

    /*
     * processNotBilledHours()
     * Get and bill hours that should be billed
     *
     * sponsorings: array of sposnorings
     * forVolunteer: true to process volunteer sponsors, false to process team sponsors
    */
  static processNotBilledHours(sponsorings, forVolunteer = true) {
    const promises = sponsorings.map((sponsoring) => {
      if (sponsoring) {
                // For each sponsoring contracts, get supported node hours created after the last billing timestamp
        return Sponsor.getNotBilledHours(sponsoring.sponsor, sponsoring.supported, forVolunteer)
                .then((hoursNodes) => {
                  if (hoursNodes.length > 0) {
                    return Sponsor.billHours(sponsoring, hoursNodes, forVolunteer);
                  } else {
                    console.log(`No hours to bill to ${sponsoring.sponsor.firstName} ${sponsoring.sponsor.lastName}`);
                    return Promise.resolve();
                  }
                })
                .catch((getNotBilledHoursError) => {
                  return Promise.reject(getNotBilledHoursError);
                });
      }
    });

    return Promise.all(promises);
  };

    /*
     * getNotBilledHours()
     * Retrieve hours that has not already been charged to sponsor
     *
     * sponsor: sponsor object
     * forVolunteer: true to process volunteer sponsors, false to process team sponsors
    */
  static getNotBilledHours(sponsor, supported, forVolunteer) {
    if (forVolunteer) {
            // Get volunteer contract not billed hours
      return db.query(`
                MATCH (hours:HOUR)<-[:VOLUNTEERED]-(:VOLUNTEER {id: {supportedId}})<-[:SUPPORTING]-(:SPONSOR {id: {sponsorId}})
                WHERE hours.dateTimestamp > {lastBilling} AND hours.approved = true
                RETURN hours
                `,
                {},
        {
          sponsorId: sponsor.id,
          supportedId: supported.id,
          lastBilling: sponsor.volunteerLastBilling
        }
            ).getResults('hours');
    } else {
            // Get team contract not billed hours
      return db.query(`
                MATCH (hours:HOUR)<-[:VOLUNTEERED]-(:VOLUNTEER)-[:VOLUNTEER]->(:TEAM {id: {supportedId}})<-[:SUPPORTING]-(:SPONSOR {id: {sponsorId}})
                WHERE hours.dateTimestamp > {lastBilling} AND hours.approved = true
                RETURN hours
                `,
                {},
        {
          sponsorId: sponsor.id,
          supportedId: supported.id,
          lastBilling: sponsor.teamLastBilling
        }
            ).getResults('hours');
    }
  };

    /*
     * billHours()
     * Bill hours
     *
     * sponsoring: sponsoring object
     * hours: array of hours
     * forVolunteer: true to process volunteer sponsors, false to process team sponsors
    */
  static billHours(sponsoring, hours, forVolunteer) {
    let hoursToBill = 0;
    let amountToBill = 0;

    for (let k = 0; k < hours.length; k++) {
      hoursToBill += parseInt(hours[k].hours, 10);
    }

        // Calculate amount to bill in USD
    amountToBill = Sponsor.calculateAmountToBill(sponsoring, hoursToBill);

    if (amountToBill > config.BILLING.minimumAmount) {
      console.log(`${amountToBill} USD to bill to ${sponsoring.sponsor.firstName} ${sponsoring.sponsor.lastName}`);

      const transactionTimestamp = new Date().getTime();

      return Sponsor.chargeSponsor(sponsoring.sponsor.stripeCustomerId, amountToBill)
            .then((charged) => {
              if (forVolunteer) { // If we charged for voluteer contract
                return Sponsor.successfullChargeForVolunteer(sponsoring.supported, sponsoring, amountToBill, transactionTimestamp, charged, hoursToBill)
                    .then(() => {
                      return Promise.resolve();
                    })
                    .catch((error) => {
                      return Promise.reject(error);
                    });
              } else {
                return Sponsor.successfullChargeForTeam(sponsoring.supported, sponsoring, amountToBill, transactionTimestamp, charged, hoursToBill)
                    .then(() => {
                      return Promise.resolve();
                    })
                    .catch((error) => {
                      return Promise.reject(error);
                    });
              }
            })
            .catch((chargeErr) => {
              if (forVolunteer) { // If we tried to charge for voluteer contract
                return Sponsor.unsuccessfullChargeForVolunteer(sponsoring.supported, sponsoring, amountToBill, transactionTimestamp)
                    .then(() => {
                      return Promise.resolve();
                    })
                    .catch((error) => {
                      return Promise.reject(error);
                    });
              } else {
                return Sponsor.unsuccessfullChargeForTeam(sponsoring.supported, sponsoring, amountToBill, transactionTimestamp)
                    .then(() => {
                      return Promise.resolve();
                    })
                    .catch((error) => {
                      return Promise.reject(error);
                    });
              }
            });
    } else {
      console.log(`${amountToBill} USD to bill to ${sponsoring.sponsor.firstName} ${sponsoring.sponsor.lastName}, but minimum charge amount is set to ${config.BILLING.minimumAmount}. Waiting next billing cycle.`);
      return Promise.resolve();
    }
  };

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
     * amount: amount to charge in USD
    */
  static chargeSponsor(stripeCustomerId, amount) {
    return new Promise((resolve, reject) => {
      amount = amount * 100; // Convert to cents
      stripe.charges.create({
        amount,
        currency: 'usd',
        customer: stripeCustomerId
                // description: "Charge for test@example.com"
      }, (err, charge) => {
        if (charge) {
          resolve(charge);
        } else if (err) {
          console.log('Stripe error:', err.message);
          reject(err.message);
        }
      });
    });
  };

    /*
     * successfullChargeForVolunteer()
     * Do remaining actions after a successfull charge
     *
     * volunteer: volunteer of charged sponsoring contract
     * sponsoring: sponsoring contract
     * amountToBill
     * transactionTimestamp
     * charged: charge object returned by stripe
     * hoursToBill: number of hours billed
    */
  static successfullChargeForVolunteer(volunteer, sponsoring, amountToBill, transactionTimestamp, charged, hoursToBill) {
    return Promise.all([
            // Create a paid relation with status 1
      Sponsor.createPaidRelation(sponsoring.sponsor, amountToBill, volunteer, 1, transactionTimestamp, charged.id),
            // Update total paid on sponsoring relation
      Sponsor.updateSupportingRelationTotal(sponsoring.sponsor, amountToBill, volunteer),
            // Update last billing attribute
      Sponsor.updateSponsorLastBilling(sponsoring.sponsor, transactionTimestamp),
            // Update raised attributes on Volunteer and Team.
      Sponsor.updateRaisedAttributes(volunteer, amountToBill)
    ])
        .then(() => {
            // Get volunteer team and project
          return Volunteer.getTeamAndProject(volunteer)
            .then((result) => {
                // Send email to sponsor.
              return Mailer.sendChargeEmail(volunteer, result.project, result.team, sponsoring.sponsor, hoursToBill, amountToBill);
            });
        })
        .then(() => {
          return Promise.resolve();
        })
        .catch((err) => {
          return Promise.reject(err);
        });
  };

    /*
     * unsuccessfullChargeForVolunteer()
     * Do remaining actions after an unsuccessfull charge
     *
     * volunteer: volunteer of charged sponsoring contract
     * sponsoring: sponsoring contract
     * amountToBill
     * transactionTimestamp
    */
  static unsuccessfullChargeForVolunteer(volunteer, sponsoring, amountToBill, transactionTimestamp){
    return Promise.all([
            // Create a paid relation with status 0
      Sponsor.createPaidRelation(sponsoring.sponsor, amountToBill, volunteer, 0, transactionTimestamp),
            // Update last billing attribute
      Sponsor.updateSponsorLastBilling(sponsoring.sponsor, transactionTimestamp)
    ])
        .then(() => {
          return Promise.resolve();
        })
        .catch((dbErr) => {
          return Promise.reject(dbErr);
        });
  };

    /*
     * successfullChargeForTeam()
     * Do remaining actions after a successfull charge
     *
     * team: team of charged sponsoring contract
     * sponsoring: sponsoring contract
     * amountToBill
     * transactionTimestamp
     * charged: charge object returned by stripe
     * hoursToBill: number of hours billed
    */
  static successfullChargeForTeam(team, sponsoring, amountToBill, transactionTimestamp, charged, hoursToBill){
    return Promise.all([
            // Create a paid relation with status 1
      Sponsor.createPaidRelation(sponsoring.sponsor, amountToBill, team, 1, transactionTimestamp, charged.id),
            // Update total paid on sponsoring relation
      Sponsor.updateSupportingRelationTotal(sponsoring.sponsor, amountToBill, team),
            // Update last billing attribute
      Sponsor.updateSponsorLastBilling(sponsoring.sponsor, transactionTimestamp, false),
            // Update raised attributes on Team.
      Sponsor.updateRaisedAttributes(team, amountToBill, false)
    ])
        .then(() => {
            // Get team team and project
          return Team.getProject(team)
            .then((project) => {
                // Send email to sponsor.
              return Mailer.sendChargeEmail(null, project, team, sponsoring.sponsor, hoursToBill, amountToBill, false);
            });
        })
        .then(() => {
          return Promise.resolve();
        })
        .catch((err) => {
          return Promise.reject(err);
        });
  };

    /*
     * unsuccessfullChargeForTeam()
     * Do remaining actions after an unsuccessfull charge
     *
     * team: team of charged sponsoring contract
     * sponsoring: sponsoring contract
     * amountToBill
     * transactionTimestamp
    */
  static unsuccessfullChargeForTeam(team, sponsoring, amountToBill, transactionTimestamp){
    return Promise.all([
            // Create a paid relation with status 0
      Sponsor.createPaidRelation(sponsoring.sponsor, amountToBill, team, 0, transactionTimestamp),
            // Update last billing attribute
      Sponsor.updateSponsorLastBilling(sponsoring.sponsor, transactionTimestamp, false)
    ])
        .then(() => {
          return Promise.resolve();
        })
        .catch((dbErr) => {
          return Promise.reject(dbErr);
        });
  };

    /*
     * createPaidRelation()
     * Create a paid relation between sponsor and volunteer, which contains
     *      date,
     *      amount,
     *      status,
     *      transaction id
     *
     * sponsor: sponsor object
     * amount: amount billed in USD
     * supported: supported object
     * status: 1 if successfull transaction
     *         0 if unsuccessfull transaction
     * date: transaction timestamp
     * stripeTransactionId: id of the stripe transaction
    */
  static createPaidRelation(sponsor, amount, supported, status, date, stripeTransactionId = null){
    return db.query(`
            MATCH (sponsor:SPONSOR {id: {sponsorId} }), (supported {id: {supportedId} })
            CREATE (sponsor)-[:PAID {amount: {amount}, stripeTransactionId: {stripeTransactionId}, date: {date}, status: {status}}]->(supported)
            `,
            {},
      {
        sponsorId: sponsor.id,
        amount,
        supportedId: supported.id,
        stripeTransactionId,
        date,
        status
      }
        );
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

    /*
     * updateSponsorLastBilling()
     * Update last billing timestamp on sponsor
     *
     * sponsor: sponsor object
     * lastBilling: transaction timestamp
    */
  static updateSponsorLastBilling(sponsor, lastBilling, forVolunteer = true){
    if (forVolunteer) {
      return db.query(`
                MATCH (sponsor:SPONSOR {id: {sponsorId} })
                SET sponsor.volunteerLastBilling = {lastBilling}
                RETURN sponsor
                `,
                {},
        {
          sponsorId: sponsor.id,
          lastBilling
        }
            );
    } else {
      return db.query(`
                MATCH (sponsor:SPONSOR {id: {sponsorId} })
                SET sponsor.teamLastBilling = {lastBilling}
                RETURN sponsor
                `,
                {},
        {
          sponsorId: sponsor.id,
          lastBilling
        }
            );
    }
  };

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
