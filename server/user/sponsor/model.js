'use strict';
import neo4jDB from 'neo4j-simple';
import config from '../../config';
import { SPONSOR } from '../roles';

const db = neo4jDB(config.DB_URL);

import User from '../model';

export default class Sponsor {
    constructor(data, pledge, teamSlug = null, volunteerSlug = null) {
        let sponsor;

        return new User(data, SPONSOR)
        .then((sponsorCreated) => {
            sponsor = sponsorCreated;
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
                    CREATE (user)
                    -[:SUPPORT {
                        hourly: {hourlyPledge}
                        cap: {pledgeCap}
                        total: {pledgetotal}
                        date: {date}
                    }]
                    ->(volunteer)
                    `,
                    {},
                    {
                        userId: sponsor.id,
                        volunteerSlug,
                        hourlyPledge : pledge.hourly,
                        cap: pledge.pledgeCap,
                        total: 0,
                        date: new Date(),
                    }
                );
            }
        })
        .then((link) => {
            return Promise.resolve(sponsor);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
    }
}
