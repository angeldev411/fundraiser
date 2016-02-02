"use strict";

const config = {
    DB_URL: (process.env.GRAPHENEDB_URL || 'http://neo4j:neo5j@localhost:7474/'),
    EXPRESS_PORT: process.env.PORT || 3777,
    SESSION_CONFIG: {
        cookieName: 'session',
        secret: 'rsn0telll33333',
        duration: 720 * 60 * 60 * 1000,
        activeDuration: 1000 * 60 * 5,
        cookie: {
            ephemeral: false,
        },
    },
};

export default config;
