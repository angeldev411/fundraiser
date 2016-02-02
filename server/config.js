"use strict";

const config = {
    DB_URL: (process.env.GRAPHENEDB_URL || 'http://neo4j:neo5j@localhost:7474/'),
    EXPRESS_PORT: process.env.PORT || 3777,
};

export default config;
