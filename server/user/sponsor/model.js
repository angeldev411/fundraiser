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
                })
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
     * billSponsors()
     * Get not billed hours and charge sponsors
    */
    static billSponsors() {
        // Get all sponsors who hourly support volunteers
        return Sponsor.getSponsorsToBill()
            .then(Sponsor.processSponsoringContracts)
            .catch((getSponsorError) => {
                Promise.reject(getSponsorError);
            });
    }

    /*
     * getSponsorsToBill()
     * Retrieve sponsors who hourly supports volunteers
    */
    static getSponsorsToBill = () => {
        return db.query(`
            MATCH (sponsors:SPONSOR)-[support:SUPPORTING]->(volunteer)
            WHERE volunteer:VOLUNTEER OR volunteer:VOLUNTEER_DISABLED
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
        // console.log(sponsorings);
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
                return Promise.all([
                    // Create a paid relation with status 1
                    Sponsor.createPaidRelation(sponsoring.sponsor, amountToBill, sponsoring.volunteer, 1, transactionTimestamp, charged.id),
                    // Update total paid on sponsoring relation
                    Sponsor.updateSupportingRelationTotal(sponsoring.sponsor, amountToBill, sponsoring.volunteer),
                    // Update last billing attribute
                    Sponsor.updateSponsorLastBilling(sponsoring.sponsor, transactionTimestamp),
                    // Update raised attributes on Volunteer and Team.
                    Sponsor.updateRaisedAttributes(sponsoring.volunteer, amountToBill),
                ]);
            })
            .then(() => {
                // Get volunteer team and project
                return Volunteer.getTeamAndProject(sponsoring.volunteer)
                .then((result) => {
                    // Send email to sponsor.
                    return Mailer.sendChargeEmail(sponsoring.volunteer, result.project, result.team, sponsoring.sponsor, hoursToBill, amountToBill);
                });
            })
            .then(() => {
                return Promise.resolve();
            })
            .catch((chargeErr) => {
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
                    return Promise.reject(dbErr);
                });
            });
        } else {
            console.log(`${amountToBill} USD to bill to ${sponsoring.sponsor.firstName} ${sponsoring.sponsor.lastName}, but minimum charge amount is set to ${config.BILLING.minimumAmount}. Waiting next billing cycle.`);
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
            MATCH (sponsor:SPONSOR {id: {sponsorId}})-[support:SUPPORTING]->(volunteer)
            WHERE volunteer:VOLUNTEER OR volunteer:VOLUNTEER_DISABLED
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
        return db.query(`
            MATCH (hours:HOUR)<-[:VOLUNTEERED]->(volunteer)<-[:SUPPORTING]-(:SPONSOR {id: {sponsorId}})
            WHERE (volunteer:VOLUNTEER OR volunteer:VOLUNTEER_DISABLED) AND hours.created > {lastBilling} AND hours.approved = true
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
            WHERE volunteer:VOLUNTEER OR volunteer:VOLUNTEER_DISABLED
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
            return Promise.reject();
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
                WHERE volunteer:VOLUNTEER OR volunteer:VOLUNTEER_DISABLED
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
