'use strict';

const constantsFront = require('../src/common/constants');

const config = {
    DB_URL: (process.env.GRAPHENEDB_URL || 'http://neo4j:neo5j@localhost:7474/'),
    EXPRESS_PORT: process.env.PORT || 3777,
    SESSION_CONFIG: {
        secret: 'rsn0telll33333',
        resave: false,
        saveUninitialized: false,
        unset: 'destroy',
        cookie: {
            maxAge: 720 * 60 * 60 * 1000,
            secure: false // TODO: set to true with HTTPS
        },
    },
    S3_BASE_URL: '//s3.amazonaws.com/raiserve/',
    S3_ACCESS: {
        accessKeyId: 'AKIAJWMS4PAKZZ2LTEOA',
        secretAccessKey: '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',
        region: 'us-east-1',
    },
    STRIPE_TOKEN: 'sk_test_WNYEwSIelo8oPutqjz22lzqQ',
    USER_IMAGES_FOLDER: constantsFront.USER_IMAGES_FOLDER,
    TEAM_IMAGES_FOLDER: constantsFront.TEAM_IMAGES_FOLDER,
    MANDRILL_API_KEY: 'vojeuQGTtCu70meDb7C8ww',
    DOMAIN: process.env.HOSTNAME || constantsFront.DOMAIN || 'https://raiserve.org',
};

module.exports = config;
