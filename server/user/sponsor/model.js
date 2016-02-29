'use strict';
import neo4jDB from 'neo4j-simple';
import config from '../../config';
import { SPONSOR } from '../roles';
import userController from '../controller';

const db = neo4jDB(config.DB_URL);

import User from '../model';

export default class Sponsor {
    constructor(data, pledge, teamSlug = null, volunteerSlug = null) {
        let sponsor;

        return this.getSponsorByEmail(data.email)
        .then((existingSponsor) => { // Sponsor already exist
            sponsor = existingSponsor;
            return this.linkSponsorToSupportedNode(sponsor, pledge, teamSlug, volunteerSlug)
            .then((link) => {
                return Promise.resolve(sponsor);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
        })
        .catch((err) => { // New Sponsor
            return new User(data, SPONSOR)
            .then((sponsorCreated) => {
                sponsor = sponsorCreated;
                return this.linkSponsorToSupportedNode(sponsor, pledge, teamSlug, volunteerSlug)
                .then((link) => {
                    return Promise.resolve(sponsor);
                })
                .catch((error) => {
                    return Promise.reject(err);
                });
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
        ).getResult('user');
    }

    static getSponsors(projectSlug = null, teamSlug = null, volunteerSlug = null) {
        let query1;

        if (projectSlug && !teamSlug) {
            query1 = () => {
                return db.query(`
                        MATCH (users:SPONSOR)-[:SUPPORT]->(team:TEAM)-[:CONTRIBUTE]->(:PROJECT { slug: {projectSlug}})
                        RETURN users
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
                        MATCH (users:SPONSOR)-[:SUPPORT]->(team:TEAM { slug: {teamSlug}})
                        RETURN users
                    `,
                    {},
                    {
                        teamSlug,
                    }
                ).getResults('users');
            };
        } else if (volunteerSlug) {
            query1 = () => {
                return db.query(`
                        MATCH (users:SPONSOR)-[:SUPPORT]->(volunteer:VOLUNTEER { slug: {volunteerSlug}})
                        RETURN users
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
                    RETURN users
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
                                MATCH (user:SPONSOR {id: {userId}})-[support:SUPPORT]->(team:TEAM)-[:CONTRIBUTE]->(:PROJECT { slug: {projectSlug}})
                                RETURN {support: support, sponsored: team} AS pledge
                                `,
                                {},
                                {
                                    userId,
                                    projectSlug,
                                }
                            ).getResult('pledge');
                        };
                    } else if (teamSlug && !volunteerSlug) {
                        query2 = () => {
                            return db.query(`
                                MATCH (user:SPONSOR {id: {userId}})-[support:SUPPORT]->(team:TEAM { slug: {teamSlug}})
                                RETURN {support: support, sponsored: team} AS pledge
                                `,
                                {},
                                {
                                    userId,
                                    teamSlug,
                                }
                            ).getResult('pledge');
                        };
                    } else if (volunteerSlug) {
                        query2 = () => {
                            return db.query(`
                                MATCH (user:SPONSOR {id: {userId}})-[support:SUPPORT]->(volunteer:VOLUNTEER { slug: {volunteerSlug}})
                                RETURN {support: support, sponsored: volunteer} AS pledge
                                `,
                                {},
                                {
                                    userId,
                                    volunteerSlug,
                                }
                            ).getResult('pledge');
                        };
                    } else {
                        query2 = () => {
                            return db.query(`
                                MATCH (user:SPONSOR {id: {userId}})-[support:SUPPORT]->(sponsored)
                                RETURN {support: support, sponsored:sponsored} AS pledge
                                `,
                                {},
                                {
                                    userId,
                                }
                            ).getResult('pledge');
                        };
                    }

                    query2()
                    .then((pledge) => {
                        numberOfUsersTreated++;

                        const currentPledge = {
                            support: pledge.support,
                            sponsored: pledge.sponsored,
                        };

                        users[i].pledges.push(currentPledge);
                        // console.log(users[i]);
                        // return Promise.resolve(pledge);
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
                CREATE (user)-[:SUPPORT {hourly: {hourly}, cap: {cap}, total: {total}, date: {date}}]->(team)
                `,
                {},
                {
                    userId: sponsor.id,
                    teamSlug,
                    hourly : pledge.hourly,
                    cap: pledge.cap,
                    total: 0,
                    date: new Date(),
                }
            );
        } else if (volunteerSlug) {
            return db.query(`
                MATCH (user:SPONSOR {id: {userId} }), (volunteer:VOLUNTEER {slug: {volunteerSlug} })
                CREATE (user)-[:SUPPORT {hourly: {hourly}, cap: {cap}, total: {total}, date: {date}}]->(volunteer)
                `,
                {},
                {
                    userId: sponsor.id,
                    volunteerSlug,
                    hourly : pledge.hourly,
                    cap: pledge.cap,
                    total: 0,
                    date: new Date(),
                }
            );
        }
    }
}
