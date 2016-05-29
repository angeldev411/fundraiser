'use strict';

import * as constantsFront from '../src/common/constants';
import session from 'express-session';
import sessionFileStore from 'session-file-store';
const FileStore = sessionFileStore(session);

const S3_BUCKET = process.env.S3_BUCKET || 'raiserve-images-dev';
const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID || 'AKIAJ2DU5K5EGL3R5JSA';
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY || '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';
const SECURE = (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() !== 'development');
const PROXY = SECURE; // if we are on production secure and proxy should be set to true (proxy true means trust reverse proxy)

let config = {
    DB_URL: process.env.GRAPHENEDB_URL || 'http://neo4j:neo5j@localhost:7474/',
    EXPRESS_PORT: process.env.PORT || 3000,
    SESSION_CONFIG: {
        secret: 'rsn0telll33333',
        store: new FileStore({ logFn: () => {} }), // Remove logFn to debug
        resave: false,
        saveUninitialized: false,
        unset: 'destroy',
        cookie: {
            maxAge: 720 * 60 * 60 * 1000,
            secure: SECURE,
            proxy: PROXY,
        },
    },
    S3: {
        BASE_URL: `https://s3.amazonaws.com/${S3_BUCKET}`,
        BUCKET: S3_BUCKET,
    },
    S3_ACCESS: {
        accessKeyId: S3_ACCESS_KEY_ID,
        secretAccessKey: S3_SECRET_ACCESS_KEY,
        region: 'us-east-1',
    },
    STRIPE_TOKEN: process.env.STRIPE_SECRET_KEY || 'sk_test_VxrSBOOWOiUa2FVSDSCgZ0RX',
    USER_IMAGES_FOLDER: constantsFront.USER_IMAGES_FOLDER,
    TEAM_IMAGES_FOLDER: constantsFront.TEAM_IMAGES_FOLDER,
    MANDRILL_API_KEY: process.env.MANDRILL_API_KEY || 'fvFbEdZSRHYqCj06utSvSg',
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
export default config;
