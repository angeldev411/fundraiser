'use strict';
import DataURI from 'datauri';

const signature = (name = 'sig1') => new DataURI(`${__dirname}/files/images/signatures/${name}.png`);

const headshot = (name = 'hs1') => new DataURI(`${__dirname}/files/images/headshots/${name}.jpg`);

const splashImage = (name = 'buildon') => new DataURI(`${__dirname}/files/images/splash_images/${name}.jpg`);

const logo = (name = 'buildon') => new DataURI(`${__dirname}/files/images/logos/${name}.jpg`);

const fixtures = {
    superAdmins: [
        {
            email: 'mmmurf@gmail.com',
            password: 'testtesttest',
            hashedPassword: 'a2c96d518f1099a3b6afe29e443340f9f5fdf1289853fc034908444f2bcb8982',
            firstName: 'matt',
            lastName: 'murphy',
        },
        {
            email: 'test@test.com',
        },
    ],

    teamLeaders: [
        {
            email: 'team-leader@gmail.com',
            password: 'testtesttest',
            hashedPassword: 'a2c96d518f1099a3b6afe29e443340f9f5fdf1289853fc034908444f2bcb8982',
            firstName: 'team',
            lastName: 'leader',
        },
    ],

    projectLeaders: [
        {
            email: 'project-leader@gmail.com',
            password: 'testtesttest',
            hashedPassword: 'a2c96d518f1099a3b6afe29e443340f9f5fdf1289853fc034908444f2bcb8982',
            firstName: 'project',
            lastName: 'leader',
        },
    ],

    company: {
        name: 'Raiserve',
        shortName: 'raiserve',
        uuid: 'ghighi',
    },

    projects: [
        {
            name: 'Toys for Tots',
            slug: 't4t',
            shortDescription: 'Bring toys to the tots I’ve Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
            projectLeaderEmail: 'project-leader1@gmail.com',
        },
        {
            name: 'Buildon',
            slug: 'bo',
            shortDescription: 'build schools for your dollars I’ve Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
            projectLeaderEmail: 'project-leader2@gmail.com',
        },
    ],

    teams: [
        {
            name: `St. John's BuildOn NYC`,
            slug: 'sjbo',
            // shortDescription: 'build schools for your dollars',
            // longDescription: 'custom long desc?',
            // logoImageData: logo('sjbo'),
        },
        {
            name: 'Toy for tots LA',
            slug: 'totLA',
        },
        {
            name: 'Toy for tots MTL',
            slug: 'totMTL',
        },
    ],

    volunteers: [
        {
            id: 'iamapredefinedId',
            firstName: 'Wilson',
            lastName: 'Chen',
            email: 'wchen@aol.com',
            password: 'wilson',
            hashedPassword: '919e680ee460849a74a82614de062bfbbac76bc98a2f692952b5fcb6364e598b',
            description: 'Born on the west coast. Going to school on the east coast',
        },
        {
            firstName: 'Kathy',
            lastName: 'Simmons',
            email: 'ksim@aol.com',
            password: 'wilson',
            hashedPassword: '919e680ee460849a74a82614de062bfbbac76bc98a2f692952b5fcb6364e598b',
            description: '',
        },
        {
            firstName: 'Henry',
            lastName: 'Stevens',
            email: 'hst@aol.com',
            password: 'wilson',
            hashedPassword: '919e680ee460849a74a82614de062bfbbac76bc98a2f692952b5fcb6364e598b',
            description: '',
        },
        {
            firstName: 'Owen',
            lastName: 'Stein',
            email: 'oste@aol.com',
            password: 'wilson',
            hashedPassword: '919e680ee460849a74a82614de062bfbbac76bc98a2f692952b5fcb6364e598b',
            description: '',
        },
        {
            firstName: 'Jules',
            lastName: 'Shen',
            email: 'jshe@aol.com',
            password: 'wilson',
            hashedPassword: '919e680ee460849a74a82614de062bfbbac76bc98a2f692952b5fcb6364e598b',
            description: '',
        },
        {
            firstName: 'Kendra',
            lastName: 'Li',
            email: 'kli@aol.com',
            password: 'wilson',
            hashedPassword: '919e680ee460849a74a82614de062bfbbac76bc98a2f692952b5fcb6364e598b',
            description: '',
        },
        {
            firstName: 'Neha',
            lastName: 'Gartner',
            email: 'ng@aol.com',
            password: 'wilson',
            hashedPassword: '919e680ee460849a74a82614de062bfbbac76bc98a2f692952b5fcb6364e598b',
            description: '',
        },
        {
            firstName: 'Valerie',
            lastName: 'Brisby',
            email: 'vbrisb@aol.com',
            password: 'wilson',
            hashedPassword: '919e680ee460849a74a82614de062bfbbac76bc98a2f692952b5fcb6364e598b',
            description: '',
        },
    ],

    invite : 'ad@ad.com',

    invitee : {
        email: 'ad@ad.com',
        firstName: 'Adrien',
        lastName: 'Something',
        password: 'password',
    },

    newUser: {
        email: 'adtest@ad.com',
        firstName: 'AdrienTest',
        lastName: 'Something',
        password: 'password',
    },

    donors : [
        {
            email: 'jd@aol.com',
            amount: 55.0,
            stripeToken: 'abc',
        },
        {
            email: 'hneye@aol.com',
            amount: 10,
            stripeToken: 'def',
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
            uuid: 'svc10101',
            signatureData: signature('sig1'),
            teamShortName: 'sjbo',
            place: 'Day Camp',
            date: new Date(),
            supervisor_name: 'Robin Brenner',
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
            hours: 5.0,
            userUUID: '121212',
            uuid: 'svc10102',
            signatureData: signature('sig1'),
            teamShortName: 'sjbo',
            place: '49th Street Soup Kitchen',
            date: new Date(),
            supervisor_name: 'Tiger Hsu',
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

export default fixtures;
