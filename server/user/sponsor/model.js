'use strict';
import neo4jDB from 'neo4j-simple';
import config from '../../config';
import { SPONSOR } from '../roles';
import userController from '../controller';
import stripelib from 'stripe';

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
                    .then((link) => {
                        // If it's a one time pledge, charge customer right now
                        if (pledge.amount) {
                            this.chargeSponsor(existingSponsor.stripeCustomerId, pledge.amount);
                        }
                        return resolve(existingSponsor);
                    })
                    .catch((linkError) => {
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
                            // Link sponsor
                            return this.linkSponsorToSupportedNode(sponsor, pledge, teamSlug, volunteerSlug)
                            .then((link) => {
                                // If it's a one time pledge, charge customer right now
                                if (pledge.amount) {
                                    Sponsor.chargeSponsor(sponsor.stripeCustomerId, pledge.amount);
                                }
                                resolve(sponsor);
                            })
                            .catch((linkError) => {
                                reject('Sorry, an internal server error occured');
                            });
                        })
                        .catch((sponsorError) => {
                            reject(sponsorError);
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
                        MATCH (users:SPONSOR)-[rel]->(:TEAM { slug: {teamSlug}})
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
                                sponsored: pledges[j].name ? pledges[j].sponsored : userController.safe(pledges[j].sponsored),
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

    linkSponsorToSupportedNode(sponsor, pledge, teamSlug = null, volunteerSlug = null) {
        if (teamSlug) {
            if (pledge.hourly) {
                return db.query(`
                    MATCH (user:SPONSOR {id: {userId} }), (team:TEAM {slug: {teamSlug} })
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
                    CREATE (user)-[:SUPPORTING {hourly: {hourly}, total: {total}, date: {date}}]->(volunteer)
                    `,
                    {},
                    {
                        userId: sponsor.id,
                        volunteerSlug,
                        hourly: pledge.hourly,
                        total: 0,
                        date: new Date(),
                    }
                );
            } else if (pledge.amount) {
                return db.query(`
                    MATCH (user:SPONSOR {id: {userId} }), (volunteer:VOLUNTEER {slug: {volunteerSlug} })
                    CREATE (user)-[:DONATED {amount: {amount}, total: {total}, date: {date}}]->(volunteer)
                    `,
                    {},
                    {
                        userId: sponsor.id,
                        volunteerSlug,
                        amount: pledge.amount,
                        total: 0,
                        date: new Date(),
                    }
                );
            }
        }
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
                    reject(err);
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
                    reject(err);
                }
            });
        });
    }

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
                    // TODO if charge, send an email to customer
                    // console.log('charge', charge);

                    resolve(charge);
                } else if (err) {
                    // TODO if error, send an email to Raiserve and customer
                    // console.log('Stripe error', err.message);
                    reject(err.message);
                }
            });
        });
    };

    /*
     * billSponsors()
     * Get not billed hours and charge sponsors
    */
    static billSponsors() {
        // Get all sponsors who hourly support volunteers
        return Sponsor.getSponsorsToBill()
            .then(Sponsor.processSponsoringContracts)
            .catch((getSponsorError) => {
                console.error('get sponsors err', getSponsorError);
                Promise.reject(getSponsorError);
            });
    }

    /*
     * getSponsorsToBill()
     * Retrieve sponsors who hourly supports volunteers
    */
    static getSponsorsToBill = () => {
        return db.query(`
            MATCH (sponsors:SPONSOR)-[support:SUPPORTING]->(volunteer:VOLUNTEER)
            RETURN DISTINCT sponsors
        `).getResults('sponsors');
    };

    /*
     * processSponsoringContracts()
     * Bill sponsoring contracts
     *
     * sponsors: array of sponsors
    */
    static processSponsoringContracts = (sponsors) => {
        const promises = sponsors.map((sponsor) => {
            return Sponsor.getSponsoringContracts(sponsor)
            .then(Sponsor.processNotBilledHours)
            .catch((getSponsoringContractsError) => {
                console.error('get sponsoring contracts err', getSponsoringContractsError);
                return Promise.reject(getSponsoringContractsError);
            });
        });

        return Promise.all(promises);
    };

    /*
     * processNotBilledHours()
     * Get and bill hours that should be billed
     *
     * sponsorings: array of sposnorings
    */
    static processNotBilledHours = (sponsorings) => {
        const promises = sponsorings.map((sponsoring) => {
            // For each sponsoring contracts, get supported volunteer hours created after the last billing timestamp
            return Sponsor.getNotBilledHours(sponsoring.sponsor)
            .then((hoursNodes) => {
                if (hoursNodes.length > 0) {
                    return Sponsor.billHours(sponsoring, hoursNodes);
                } else {
                    console.log(`No hours to bill to ${sponsoring.sponsor.firstName} ${sponsoring.sponsor.lastName}`);
                    return Promise.resolve();
                }
            })
            .catch((getNotBilledHoursError) => {
                console.error('get not billed hours err', getNotBilledHoursError);
                return Promise.reject(getNotBilledHoursError);
            });
        });

        return Promise.all(promises);
    };

    /*
     * billHours()
     * Bill hours
     *
     * sponsoring: sponsoring object
     * hours: array of hours
    */
    static billHours = (sponsoring, hours) => {
        let amountToBill = 0;

        for (let k = 0; k < hours.length; k++) {
            // Calculate amount to bill in USD
            amountToBill += sponsoring.support.hourly * hours[k].hours;
        }

        if (amountToBill > config.BILLING.minimumAmount) {
            console.log(`${amountToBill} USD to bill to ${sponsoring.sponsor.firstName} ${sponsoring.sponsor.lastName}`);

            const transactionTimestamp = new Date().getTime();

            return Sponsor.chargeSponsor(sponsoring.sponsor.stripeCustomerId, amountToBill)
            .then((charge) => {
                return Promise.all([
                    // Create a paid relation with status 1
                    Sponsor.createPaidRelation(sponsoring.sponsor, amountToBill, sponsoring.volunteer, 1, transactionTimestamp, charge.id),
                    // Update last billing attribute
                    Sponsor.updateSponsorLastBilling(sponsoring.sponsor, transactionTimestamp),
                    // TODO Update raised attributes on Volunteer and Team.
                ]);
            })
            .then(() => {
                return Promise.resolve();
            })
            .catch((chargeErr) => {
                console.log('Stripe error:', chargeErr);
                return Promise.all([
                    // Create a paid relation with status 0
                    Sponsor.createPaidRelation(sponsoring.sponsor, amountToBill, sponsoring.volunteer, 0, transactionTimestamp),
                    // Update last billing attribute
                    Sponsor.updateSponsorLastBilling(sponsoring.sponsor, transactionTimestamp),
                ])
                .then(() => {
                    return Promise.resolve();
                })
                .catch((dbErr) => {
                    console.log(dbErr);
                    return Promise.reject(dbErr);
                });
            });
        } else {
            return Promise.resolve();
        }
    };

    /*
     * getSponsoringContracts()
     * Retrieve sponsoring contracts, with hourly amount
     *
     * sponsor: sponsor object
    */
    static getSponsoringContracts = (sponsor) => {
        return db.query(`
            MATCH (sponsor:SPONSOR {id: {sponsorId}})-[support:SUPPORTING]->(volunteer:VOLUNTEER)
            RETURN {sponsor: sponsor, support: support, volunteer: volunteer} AS sponsoring
            `,
            {},
            {
                sponsorId: sponsor.id,
            }
        ).getResults('sponsoring');
    };

    /*
     * getNotBilledHours()
     * Retrieve hours that has not already been charged to sponsor
     *
     * sponsor: sponsor object
    */
    static getNotBilledHours = (sponsor) => {
        // TODO CHANGE TO ONLY GET APPROVED HOURS
        return db.query(`
            MATCH (hours:HOUR)<-[:VOLUNTEERED]->(volunteer:VOLUNTEER)<-[:SUPPORTING]-(:SPONSOR {id: {sponsorId}})
            WHERE hours.created > {lastBilling}
            RETURN hours
            `,
            {},
            {
                sponsorId: sponsor.id,
                lastBilling: sponsor.lastBilling,
            }
        ).getResults('hours');
    };

    /*
     * createPaidRelation()
     * Create a paid relation between sponsor and volunteer, which contains date, amount, status and transaction id
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
            MATCH (sponsor:SPONSOR {id: {sponsorId} }), (volunteer:VOLUNTEER {id: {volunteerId} })
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
     * updateSponsorLastBilling()
     * Update last billing timestamp on sponsor
     *
     * sponsor: sponsor object
     * lastBilling: transaction timestamp
    */
    static updateSponsorLastBilling = (sponsor, lastBilling) => {
        return db.query(`
            MATCH (sponsor:SPONSOR {id: {sponsorId} })
            SET sponsor.lastBilling = {lastBilling}
            RETURN sponsor
            `,
            {},
            {
                sponsorId: sponsor.id,
                lastBilling,
            }
        );
    };
}
