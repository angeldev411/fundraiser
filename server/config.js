'use strict';

import * as constantsFront from '../src/common/constants';
import session from 'express-session';
import sessionFileStore from 'session-file-store';
const FileStore = sessionFileStore(session);

export default {
    DB_URL: (process.env.GRAPHENEDB_URL || 'http://neo4j:neo5j@localhost:7474/'),
    EXPRESS_PORT: process.env.PORT || 80,
    SESSION_CONFIG: {
        secret: 'rsn0telll33333',
        store: new FileStore({ logFn: function(){} }), // Remove logFn to debug
        resave: false,
        saveUninitialized: false,
        unset: 'destroy',
        cookie: {
            maxAge: 720 * 60 * 60 * 1000,
            secure: true // TODO: set to true with HTTPS
        },
    },
    S3: {
        BASE_URL: 'https://s3.amazonaws.com/raiserve-images',
        BUCKET: 'raiserve-images',
    },
    S3_ACCESS: {
        accessKeyId: 'AKIAIGQPJ2MQF6YBZBWQ',
        secretAccessKey: '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',
        region: 'us-east-1',
    },
    STRIPE_TOKEN: 'sk_test_VxrSBOOWOiUa2FVSDSCgZ0RX',
    USER_IMAGES_FOLDER: constantsFront.USER_IMAGES_FOLDER,
    TEAM_IMAGES_FOLDER: constantsFront.TEAM_IMAGES_FOLDER,
    MANDRILL_API_KEY: (process.env.MANDRILL_API_KEY || 'fvFbEdZSRHYqCj06utSvSg'),
    DOMAIN: process.env.HOSTNAME || constantsFront.DOMAIN || 'https://raiserve.org',
    URL: `${process.env.PROTOCOL}${process.env.HOSTNAME}` || 'http://raiserve.org',
    BILLING: {
        minimumAmount: 5,
    },
    MAILCHIMP: {
        API_KEY: 'e01efe9b4d33711baa136f42047f7abb-us11',
        VOLUNTEERS_LIST_ID: '7230036f0d',
        SPONSOR_LIST_ID: 'a9215c0ba0',
        TEAMLEADER_LIST_ID: '3e83d1fad5',
    },
};
