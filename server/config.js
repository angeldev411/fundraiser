'use strict';

import * as constantsFront from '../src/common/constants';
import session from 'express-session';
import sessionFileStore from 'session-file-store';
const FileStore = sessionFileStore(session);

export default {
    DB_URL: (process.env.GRAPHENEDB_URL || 'http://neo4j:neo5j@localhost:7474/'),
    EXPRESS_PORT: process.env.PORT || 3777,
    SESSION_CONFIG: {
        secret: 'rsn0telll33333',
        store: new FileStore({ logFn: function(){} }), // Remove logFn to debug
        resave: false,
        saveUninitialized: false,
        unset: 'destroy',
        cookie: {
            maxAge: 720 * 60 * 60 * 1000,
            secure: false // TODO: set to true with HTTPS
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
    STRIPE_TOKEN: 'sk_test_WNYEwSIelo8oPutqjz22lzqQ',
    USER_IMAGES_FOLDER: constantsFront.USER_IMAGES_FOLDER,
    MANDRILL_API_KEY: 'vojeuQGTtCu70meDb7C8ww',
    DOMAIN: process.env.HOSTNAME || constantsFront.DOMAIN || 'https://raiserve.org',
    URL: `${process.env.PROTOCOL}${process.env.HOSTNAME}` || 'http://raiserve.org',
};
