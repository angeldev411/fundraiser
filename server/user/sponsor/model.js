'use strict';
import neo4jDB from 'neo4j-simple';
import config from '../../config';
import { SPONSOR } from '../roles';
import userController from '../controller';
import Volunteer from '../volunteer/model';
import stripelib from 'stripe';
import * as Urls from '../../../src/urls';
import * as Constants from '../../../src/common/constants';
import Mailer from '../../helpers/mailer';
import Mailchimp from '../../helpers/mailchimp';
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
                            stripeCustomerId: customer.id,
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
                userEmail,
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
                        projectSlug,
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
                        teamSlug,
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
                            exclude,
                        }
                    ).getResults('users')
                    .then((results2) => {
                        return Promise.resolve([
                            ...results1,
                            ...results2,
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
                        volunteerSlug,
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
                                MATCH (user:SPONSOR {id: {userId}})-[support:SUPPORTING|DONATED]->(sponsored)-[*]->(:PROJECT { slug: {projectSlug}})
                                RETURN {support: support, sponsored: sponsored} AS pledges
                                `,
                                {},
                                {
                                    userId,
                                    projectSlug,
                                }
                            ).getResults('pledges');
                        };
                    } else if (teamSlug && !volunteerSlug) {
                        query2 = () => {
                            return db.query(`
                                MATCH (user:SPONSOR {id: {userId}})-[support:SUPPORTING|DONATED]->(team:TEAM { slug: {teamSlug}})
                                RETURN {support: support, sponsored: team} AS pledges
                                `,
                                {},
                                {
                                    userId,
                                    teamSlug,
                                }
                            ).getResults('pledges')
                            .then((results1) => {
                                return db.query(`
                                    MATCH (user:SPONSOR {id: {userId}})-[support:SUPPORTING|DONATED]->(volunteer)-->(team:TEAM { slug: {teamSlug}})
                                    RETURN {support: support, sponsored: volunteer} AS pledges
                                    `,
                                    {},
                                    {
                                        userId,
                                        teamSlug,
                                    }
                                ).getResults('pledges')
                                .then((results2) => {
                                    return Promise.resolve([
                                        ...results1,
                                        ...results2,
                                    ]);
                                });
                            });
                        };
                    } else if (volunteerSlug) {
                        query2 = () => {
                            return db.query(`
                                MATCH (user:SPONSOR {id: {userId}})-[support:SUPPORTING|DONATED]->(volunteer:VOLUNTEER { slug: {volunteerSlug}})
                                RETURN {support: support, sponsored: volunteer} AS pledges
                                `,
                                {},
                                {
                                    userId,
                                    volunteerSlug,
                                }
                            ).getResults('pledges');
                        };
                    } else {
                        query2 = () => {
                            return db.query(`
                                MATCH (user:SPONSOR {id: {userId}})-[support:SUPPORTING|DONATED]->(sponsored)
                                RETURN {support: support, sponsored:sponsored} AS pledges
                                `,
                                {},
                                {
                                    userId,
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
                                sponsored: pledges[j].sponsored.name ? pledges[j].sponsored : userController.safe(pledges[j].sponsored),
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
        if (teamSlug) {
            if (pledge.hourly) {
                return db.query(`
                    MATCH (user:SPONSOR {id: {userId} }), (team:TEAM {slug: {teamSlug} })
                    SET team.totalSponsors = team.totalSponsors + 1
                    CREATE (user)-[:SUPPORTING {hourly: {hourly}, total: {total}, date: {date}}]->(team)
                    `,
                    {},
                    {
                        userId: sponsor.id,
                        teamSlug,
                        hourly: pledge.hourly,
                        total: 0,
                        date: new Date(),
                    }
                );
            } else if (pledge.amount) {
                return db.query(`
                    MATCH (user:SPONSOR {id: {userId} }), (team:TEAM {slug: {teamSlug} })
                    SET team.totalSponsors = team.totalSponsors + 1
                    CREATE (user)-[:DONATED {amount: {amount}, total: {total}, date: {date}}]->(team)
                    `,
                    {},
                    {
                        userId: sponsor.id,
                        teamSlug,
                        amount: pledge.amount,
                        total: 0,
                        date: new Date(),
                    }
                );
            }
        } else if (volunteerSlug) {
            if (pledge.hourly) {
                return db.query(`
                    MATCH (user:SPONSOR {id: {userId} }), (volunteer:VOLUNTEER {slug: {volunteerSlug} })
                    SET volunteer.hourlyPledge = volunteer.hourlyPledge + {hourly}, volunteer.totalSponsors = volunteer.totalSponsors + 1
                    CREATE (user)-[:SUPPORTING {hourly: {hourly}, total: {total}, date: {date}}]->(volunteer)
                    RETURN volunteer
                    `,
                    {},
                    {
                        userId: sponsor.id,
                        volunteerSlug,
                        hourly: parseInt(pledge.hourly, 10),
                        total: 0,
                        date: new Date(),
                    }
                )
                .getResult('volunteer')
                .then((volunteer) => {
                    return Sponsor.sendSponsorshipEmails(volunteer, sponsor, pledge.hourly, true)
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
                        date: new Date(),
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

    static sendSponsorshipEmails(volunteer, sponsor, amountHourly, hourly = false) {
        return Volunteer.getTeamAndProject(volunteer)
        .then((result) => {
            volunteer = {
                ...volunteer,
                project: result.project,
                team: result.team,
            };

            if (hourly) {
                return Promise.all([
                    Mailer.sendVolunteerSponsorshipEmail(volunteer, sponsor),
                    Mailer.sendSponsorSponsorshipThanksEmail(volunteer, sponsor),
                ])
                .then(() => {
                    return Promise.resolve();
                })
                .catch((err) => {
                    return Promise.reject(err);
                });
            } else {
                return Promise.all([
                    Mailer.sendSponsorDonationThanksEmail(volunteer, sponsor, amountHourly),
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
                source: stripeToken,
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
                source: stripeToken,
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
     * billSponsors()
     * MAIN BILLING SCRIPT
     * Get not billed hours and charge sponsors
    */
    static billSponsors() {
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
    static getSponsorsToBill = () => {
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
    static processVolunteerSponsoringContracts = (sponsors) => {
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
    static getVolunteerSponsoringContracts = (sponsor) => {
        return db.query(`
            MATCH (sponsor:SPONSOR {id: {sponsorId}})-[support:SUPPORTING]->(volunteer)
            WHERE volunteer:VOLUNTEER OR volunteer:VOLUNTEER_DISABLED
            RETURN {sponsor: sponsor, support: support, supported: volunteer} AS sponsorings
            `,
            {},
            {
                sponsorId: sponsor.id,
            }
        ).getResults('sponsorings');
    };

    /*
     * processTeamSponsoringContracts()
     * Bill sponsoring contracts on volunteers
     *
     * sponsors: array of sponsors
    */
    static processTeamSponsoringContracts = (sponsors) => {
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
    static getTeamSponsoringContracts = (sponsor) => {
        return db.query(`
            MATCH (sponsor:SPONSOR {id: {sponsorId}})-[support:SUPPORTING]->(team:TEAM)
            RETURN {sponsor: sponsor, support: support, supported: team} AS sponsoring
            `,
            {},
            {
                sponsorId: sponsor.id,
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
    static processNotBilledHours = (sponsorings, forVolunteer = true) => {
        const promises = sponsorings.map((sponsoring) => {
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
    static getNotBilledHours = (sponsor, supported, forVolunteer) => {
        if (forVolunteer) {
            // Get volunteer contract not billed hours
            return db.query(`
                MATCH (hours:HOUR)<-[:VOLUNTEERED]-(:VOLUNTEER {id: {supportedId}})<-[:SUPPORTING]-(:SPONSOR {id: {sponsorId}})
                WHERE hours.created > {lastBilling} AND hours.approved = true
                RETURN hours
                `,
                {},
                {
                    sponsorId: sponsor.id,
                    supportedId: supported.id,
                    lastBilling: sponsor.volunteerLastBilling,
                }
            ).getResults('hours');
        } else {
            // Get team contract not billed hours
            return db.query(`
                MATCH (hours:HOUR)<-[:VOLUNTEERED]-(:VOLUNTEER)-[:VOLUNTEER]->(:TEAM {id: {supportedId}})<-[:SUPPORTING]-(:SPONSOR {id: {sponsorId}})
                WHERE hours.created > {lastBilling} AND hours.approved = true
                RETURN hours
                `,
                {},
                {
                    sponsorId: sponsor.id,
                    supportedId: supported.id,
                    lastBilling: sponsor.sponsorLastBilling,
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
    static billHours = (sponsoring, hours, forVolunteer) => {
        let hoursToBill = 0;
        let amountToBill = 0;

        for (let k = 0; k < hours.length; k++) {
            hoursToBill += hours[k].hours;
        }

        // Calculate amount to bill in USD
        amountToBill = sponsoring.support.hourly * hoursToBill;

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
                    console.log('Jackpot !!');
                    // TODO
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
                    console.log('Jackpot !!');
                    // TODO
                }
            });
        } else {
            console.log(`${amountToBill} USD to bill to ${sponsoring.sponsor.firstName} ${sponsoring.sponsor.lastName}, but minimum charge amount is set to ${config.BILLING.minimumAmount}. Waiting next billing cycle.`);
            return Promise.resolve();
        }
    };

    /*
     * chargeSponsor()
     * Charge amount to stripe customer
     *
     * stripeCustomerId: stripe customer id to charge
     * amount: amount to charge in USD
    */
    static chargeSponsor = (stripeCustomerId, amount) => {
        return new Promise((resolve, reject) => {
            amount = amount * 100; // Convert to cents
            stripe.charges.create({
                amount,
                currency: 'usd',
                customer: stripeCustomerId,
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
    static successfullChargeForVolunteer = (volunteer, sponsoring, amountToBill, transactionTimestamp, charged, hoursToBill) => {
        return Promise.all([
            // Create a paid relation with status 1
            Sponsor.createPaidRelation(sponsoring.sponsor, amountToBill, volunteer, 1, transactionTimestamp, charged.id),
            // Update total paid on sponsoring relation
            Sponsor.updateSupportingRelationTotal(sponsoring.sponsor, amountToBill, volunteer),
            // Update last billing attribute
            // TODO Sponsor.updateSponsorLastBilling(sponsoring.sponsor, transactionTimestamp),
            // Update raised attributes on Volunteer and Team.
            Sponsor.updateRaisedAttributes(volunteer, amountToBill),
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
    static unsuccessfullChargeForVolunteer = (volunteer, sponsoring, amountToBill, transactionTimestamp) => {
        return Promise.all([
            // Create a paid relation with status 0
            Sponsor.createPaidRelation(sponsoring.sponsor, amountToBill, volunteer, 0, transactionTimestamp),
            // Update last billing attribute
            // TODO Sponsor.updateSponsorLastBilling(sponsoring.sponsor, transactionTimestamp),
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
     * volunteer: volunteer object
     * status: 1 if successfull transaction
     *         0 if unsuccessfull transaction
     * date: transaction timestamp
     * stripeTransactionId: id of the stripe transaction
    */
    static createPaidRelation = (sponsor, amount, volunteer, status, date, stripeTransactionId = null) => {
        return db.query(`
            MATCH (sponsor:SPONSOR {id: {sponsorId} }), (volunteer {id: {volunteerId} })
            WHERE volunteer:VOLUNTEER OR volunteer:VOLUNTEER_DISABLED
            CREATE (sponsor)-[:PAID {amount: {amount}, stripeTransactionId: {stripeTransactionId}, date: {date}, status: {status}}]->(volunteer)
            `,
            {},
            {
                sponsorId: sponsor.id,
                amount,
                volunteerId: volunteer.id,
                stripeTransactionId,
                date,
                status,
            }
        );
    };

    /*
     * updateSupportingRelationTotal()
     * Update the total donated on the support contract
     *
     * sponsor: sponsor object
     * amount: amount billed in USD
     * volunteer: volunteer object
    */
    static updateSupportingRelationTotal = (sponsor, amount, volunteer) => {
        return db.query(`
            MATCH (sponsor:SPONSOR {id: {sponsorId} })-[support:SUPPORTING]->(volunteer {id: {volunteerId} })
            WHERE volunteer:VOLUNTEER OR volunteer:VOLUNTEER_DISABLED
            SET support.total = support.total + {amount}
            RETURN support
            `,
            {},
            {
                sponsorId: sponsor.id,
                amount,
                volunteerId: volunteer.id,
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
    static updateSponsorLastBilling = (sponsor, lastBilling, forVolunteer) => {
        if (forVolunteer) {
            return db.query(`
                MATCH (sponsor:SPONSOR {id: {sponsorId} })
                SET sponsor.volunteerLastBilling = {lastBilling}
                RETURN sponsor
                `,
                {},
                {
                    sponsorId: sponsor.id,
                    lastBilling,
                }
            );
        } else {
            return db.query(`
                MATCH (sponsor:SPONSOR {id: {sponsorId} })
                SET sponsor.sponsorLastBilling = {lastBilling}
                RETURN sponsor
                `,
                {},
                {
                    sponsorId: sponsor.id,
                    lastBilling,
                }
            );
        }
    };

    /*
     * updateRaisedAttributes()
     * Update raised attribute on a volunteer and totalRaised attribute on related team
     *
     * volunteer: volunteer object
     * raised: raised money, so just charged amount
    */
    static updateRaisedAttributes = (volunteer, raised) => {
        let data;

        return db.query(`
            MATCH (volunteer {id: {volunteerId} })-[:VOLUNTEER]->(team:TEAM)<-[:LEAD]-(teamLeader:TEAM_LEADER)
            WHERE NOT (teamLeader:FAKE_LEADER) AND (volunteer:VOLUNTEER OR volunteer:VOLUNTEER_DISABLED)
            SET     volunteer.raised = volunteer.raised + {raised},
                    team.totalRaised = team.totalRaised + {raised}
            RETURN {volunteer: volunteer, teamLeader: teamLeader} AS result
            `,
            {},
            {
                volunteerId: volunteer.id,
                raised: parseInt(raised, 10),
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
    };

    /*
     * updateRaisedAttributesBySlug()
     * Update raised and totalRaised attributes on a volunteer and related team
     *
     * volunteer: volunteer object
     * raised: raised money, so just charged amount
    */
    static updateRaisedAttributesBySlug = (volunteerSlug = null, teamSlug = null, raised) => {
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
                    raised: parseInt(raised, 10),
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
                    raised: parseInt(raised, 10),
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
}
