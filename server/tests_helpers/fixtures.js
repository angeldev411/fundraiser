'use strict';
const DataURI = require('datauri');

const signature = (name = 'sig1') => new DataURI(`${__dirname}/files/images/signatures/${name}.png`);

const headshot = (name = 'hs1') => new DataURI(`${__dirname}/files/images/headshots/${name}.jpg`);

const splashImage = (name = 'buildon') => new DataURI(`${__dirname}/files/images/splash_images/${name}.jpg`);

const logo = (name = 'buildon') => new DataURI(`${__dirname}/files/images/logos/${name}.jpg`);

const fixtures = {
    initialUsers: {
        email: 'mmmurf@gmail.com',
        password: 'testtesttest',
        firstName: 'matt',
        lastName: 'murphy',
        uuid: 'abcd1234',
    },

    company: {
        name: 'Raiserve',
        shortName: 'raiserve',
        uuid: 'ghighi',
    },

    superAdmin: {
        companyUUID: 'ghighi',
        userUUID: 'abcd1234',
    },

    projects: [
        {
            name: 'Toys for Tots',
            shortName: 't4t',
            shortDescription: 'bring toys to the tots',
            longDescription: 'toys for tots is an amazing program',
            creatorUUID: 'abcd1234',
            uuid: '543234',
            splashImageData: splashImage('t4t'),
        },
        {
            name: 'Buildon',
            shortName: 'bo',
            shortDescription: 'build schools for your dollars',
            longDescription: 'this is one of the most innovative programs',
            creatorUUID: 'abcd1234',
            uuid: '565656',
            splashImageData: splashImage('buildon'),
        },
    ],

    team: {
        name: "St. John's BuildOn",
        shortName: 'sjbo',
        shortDescription: 'build schools for your dollars',
        longDescription: 'custom long desc?',
        creatorUUID: 'abcd1234',
        leaderUUID: 'abcd1234', // this is matt
        projectUUID: '565656',
        logoImageData: logo('sjbo'),
    },

    volunteers: [
        {
            firstName: 'Wilson',
            lastName: 'Chen',
            email: 'wchen@aol.com',
            password: 'wilson',
            teamShortName: 'sjbo',
            headshotData: headshot('hs1'),
            uuid: '12341234',
            bio: 'Born on the west coast. Going to school on the east coast',
            projectStatement: 'Buildon means a lot to me because they bring schools',
        },
        {
            firstName: 'Kathy',
            lastName: 'Simmons',
            email: 'ksim@aol.com',
            password: 'wilson',
            teamShortName: 'sjbo',
            headshotData: headshot('hs1'),
            uuid: '123123',
            bio: '',
            projectStatement: '',
        },
        {
            firstName: 'Henry',
            lastName: 'Stevens',
            email: 'hst@aol.com',
            password: 'wilson',
            teamShortName: 'sjbo',
            headshotData: headshot('hs1'),
            bio: '',
            projectStatement: '',
        },
        {
            firstName: 'Owen',
            lastName: 'Stein',
            email: 'oste@aol.com',
            password: 'wilson',
            teamShortName: 'sjbo',
            headshotData: headshot('hs1'),
            bio: '',
            projectStatement: '',
        },
        {
            firstName: 'Jules',
            lastName: 'Shen',
            email: 'jshe@aol.com',
            password: 'wilson',
            teamShortName: 'sjbo',
            headshotData: headshot('hs1'),
            bio: '',
            projectStatement: '',
        },
        {
            firstName: 'Kendra',
            lastName: 'Li',
            email: 'kli@aol.com',
            password: 'wilson',
            teamShortName: 'sjbo',
            headshotData: headshot('hs1'),
            bio: '',
            projectStatement: '',
        },
        {
            firstName: 'Neha',
            lastName: 'Gartner',
            email: 'ng@aol.com',
            password: 'wilson',
            teamShortName: 'sjbo',
            headshotData: headshot('hs1'),
            uuid: '121212',
            bio: '',
            projectStatement: '',
        },
        {
            firstName: 'Valerie',
            lastName: 'Brisby',
            email: 'vbrisb@aol.com',
            password: 'wilson',
            teamShortName: 'sjbo',
            headshotData: headshot('hs1'),
            bio: '',
            projectStatement: '',
        },
    ],

    donors : [
        {
            firstName: 'Jim',
            lastName: 'Doughrety',
            email: 'jd@aol.com',
            amount: 55.0,
            stripeToken: 'abc',
            teamShortName: 'sjbo',
            volunteerUUID: '12341234',
        },
        {
            firstName: 'Helen',
            lastName: 'Nye',
            email: 'hneye@aol.com',
            amount: 10,
            stripeToken: 'def',
            teamShortName: 'sjbo',
            volunteerUUID: '12341234',
        },
    ],

    pledges : [
        {
            firstName: 'Renee',
            lastName: 'Raeburn',
            email: 'rr@aol.com',
            amountPerHour: 10,
            maxPerMonth: 100,
            volunteerUUID: null,
            teamShortName: 'sjbo',
        },
        {
            firstName: 'Dennis',
            lastName: 'Lord',
            email: 'dlord@aol.com',
            amountPerHour: 1,
            maxPerMonth: 1000,
            volunteerUUID: null,
            teamShortName: 'sjbo',
        },
        {
            firstName: 'Jacob',
            lastName: 'Lawler',
            email: 'jl@aol.com',
            amountPerHour: 2.15,
            maxPerMonth: 500,
            volunteerUUID: '123123',
            teamShortName: 'sjbo',
        },
        {
            firstName: 'Dani',
            lastName: 'Boehle',
            email: 'db@aol.com',
            amountPerHour: 1.10,
            maxPerMonth: 500,
            volunteerUUID: '123123',
            teamShortName: 'sjbo',
        },
        {
            firstName: 'Frank',
            lastName: 'Boehle',
            email: 'fb@aol.com',
            amountPerHour: 3,
            maxPerMonth: 700,
            volunteerUUID: '123123',
            teamShortName: 'sjbo',
        },
    ],

    hours : [
        {
            userUUID: '12341234',
            hours: 1.0,
            signatureData: signature('sig1'),
            teamShortName: 'sjbo',
            uuid: 'svc10101',
            place: 'Day Camp',
            date: new Date(), supervisor_name: 'Robin Brenner',
        },
        {
            userUUID: '12341234',
            hours: 3.0,
            signatureData: signature('sig1'),
            teamShortName: 'sjbo',
            place: 'Wycroft School After School',
            date: new Date(),
            supervisor_name: 'Dawn V',
        },
        {
            userUUID: '121212',
            hours: 5.0,
            signatureData: signature('sig1'),
            teamShortName: 'sjbo',
            uuid: 'svc10102',
            place: '49th Street Soup Kitchen',
            date: new Date(), supervisor_name: 'Tiger Hsu',
        },
    ],

    approvals : [
        {
            leaderUUID: 'abcd1234',
            serviceUUID: 'svc10101',
            signatureData: signature('sig1'),
        },
        {
            leaderUUID: 'abcd1234',
            serviceUUID: 'svc10102',
            signatureData: signature('sig1'),
        },
    ],
};

module.exports = fixtures;
