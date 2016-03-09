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
                // MATCH (user:SPONSOR {id: {userId}})-[support:SUPPORT]->(sponsored)-[*]->(:PROJECT { slug: {projectSlug}})
                return db.query(`
                        MATCH (users:SPONSOR)-[:SUPPORT]->(sponsored)-[*]->(:PROJECT { slug: {projectSlug}})
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
                        MATCH (users:SPONSOR)-[:SUPPORT]->(:TEAM { slug: {teamSlug}})
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
                        MATCH (users:SPONSOR)-[:SUPPORT]->(:VOLUNTEER)-->(:TEAM { slug: {teamSlug}})
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
                        MATCH (users:SPONSOR)-[:SUPPORT]->(:VOLUNTEER { slug: {volunteerSlug}})
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
                                MATCH (user:SPONSOR {id: {userId}})-[support:SUPPORT]->(sponsored)-[*]->(:PROJECT { slug: {projectSlug}})
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
                                MATCH (user:SPONSOR {id: {userId}})-[support:SUPPORT]->(team:TEAM { slug: {teamSlug}})
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
                                    MATCH (user:SPONSOR {id: {userId}})-[support:SUPPORT]->(volunteer)-->(team:TEAM { slug: {teamSlug}})
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
                                MATCH (user:SPONSOR {id: {userId}})-[support:SUPPORT]->(volunteer:VOLUNTEER { slug: {volunteerSlug}})
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
                                MATCH (user:SPONSOR {id: {userId}})-[support:SUPPORT]->(sponsored)
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
            return db.query(`
                MATCH (user:SPONSOR {id: {userId} }), (team:TEAM {slug: {teamSlug} })
                CREATE (user)-[:SUPPORT {hourly: {hourly}, amount: {amount}, total: {total}, date: {date}}]->(team)
                `,
                {},
                {
                    userId: sponsor.id,
                    teamSlug,
                    hourly: pledge.hourly || null,
                    amount: pledge.amount || null,
                    total: 0,
                    date: new Date(),
                }
            );
        } else if (volunteerSlug) {
            return db.query(`
                MATCH (user:SPONSOR {id: {userId} }), (volunteer:VOLUNTEER {slug: {volunteerSlug} })
                CREATE (user)-[:SUPPORT {hourly: {hourly}, amount: {amount}, total: {total}, date: {date}}]->(volunteer)
                `,
                {},
                {
                    userId: sponsor.id,
                    volunteerSlug,
                    hourly: pledge.hourly || null,
                    amount: pledge.amount || null,
                    total: 0,
                    date: new Date(),
                }
            );
        }
    }
}
