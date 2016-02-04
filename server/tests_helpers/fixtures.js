'use strict';
const dataURI = require('dataURI');

class fixtures {
    static signature(name = 'sig1') {
        return dataURI(`app/spec/files/images/signatures/${name}.png`);
    }

    static headshot(name = 'hs1') {
        return dataURI(`app/spec/files/images/headshots/${name}.jpg`);
    }

    static splashImage(name = 'buildon') {
        return dataURI(`app/spec/files/images/splash_images/${name}.jpg`);
    }

    static logo(name = 'buildon') {
        return dataURI(`app/spec/files/images/logos/${name}.jpg`);
    }

    initialUsers = {
        email: 'mmmurf@gmail.com',
        password: 'testtesttest',
        first_name: 'matt',
        last_name: 'murphy',
        uuid: 'abcd1234',
    };

    company = {
        name: 'Raiserve',
        short_name: 'raiserve',
        uuid: 'ghighi',
    };

    superAdmin = {
        company_uuid: 'ghighi',
        user_uuid: 'abcd1234',
    };

    projects = [
        {
            name: 'Toys for Tots',
            short_name: 't4t',
            short_description: 'bring toys to the tots',
            long_description: 'toys for tots is an amazing program',
            creator_uuid: 'abcd1234',
            uuid: '543234',
            splash_image_data: fixtures.splashImage('t4t'),
        },
        {
            name: 'Buildon',
            short_name: 'bo',
            short_description: 'build schools for your dollars',
            long_description: 'this is one of the most innovative programs',
            creator_uuid: 'abcd1234',
            uuid: '565656',
            splash_image_data: fixtures.splashImage('buildon'),
        },
    ];

    team = {
        name: "St. John's BuildOn",
        short_name: 'sjbo',
        short_description: 'build schools for your dollars',
        long_description: 'custom long desc?',
        creator_uuid: 'abcd1234',
        leader_uuid: 'abcd1234', // this is matt
        project_uuid: '565656',
        logo_image_data: fixtures.logo('sjbo'),
    };

    volunteers = [
        {
            first_name: 'Wilson',
            last_name: 'Chen',
            email: 'wchen@aol.com',
            password: 'wilson',
            team_short_name: 'sjbo',
            headshot_data: fixtures.headshot('hs1'),
            uuid: '12341234',
            bio: 'Born on the west coast. Going to school on the east coast',
            project_statement: 'Buildon means a lot to me because they bring schools',
        },
        {
            first_name: 'Kathy',
            last_name: 'Simmons',
            email: 'ksim@aol.com',
            password: 'wilson',
            team_short_name: 'sjbo',
            headshot_data: fixtures.headshot('hs1'),
            uuid: '123123',
            bio: '',
            project_statement: '',
        },
        {
            first_name: 'Henry',
            last_name: 'Stevens',
            email: 'hst@aol.com',
            password: 'wilson',
            team_short_name: 'sjbo',
            headshot_data: fixtures.headshot('hs1'),
            bio: '',
            project_statement: '',
        },
        {
            first_name: 'Owen',
            last_name: 'Stein',
            email: 'oste@aol.com',
            password: 'wilson',
            team_short_name: 'sjbo',
            headshot_data: fixtures.headshot('hs1'),
            bio: '',
            project_statement: '',
        },
        {
            first_name: 'Jules',
            last_name: 'Shen',
            email: 'jshe@aol.com',
            password: 'wilson',
            team_short_name: 'sjbo',
            headshot_data: fixtures.headshot('hs1'),
            bio: '',
            project_statement: '',
        },
        {
            first_name: 'Kendra',
            last_name: 'Li',
            email: 'kli@aol.com',
            password: 'wilson',
            team_short_name: 'sjbo',
            headshot_data: fixtures.headshot('hs1'),
            bio: '',
            project_statement: '',
        },
        {
            first_name: 'Neha',
            last_name: 'Gartner',
            email: 'ng@aol.com',
            password: 'wilson',
            team_short_name: 'sjbo',
            headshot_data: fixtures.headshot('hs1'),
            uuid: '121212',
            bio: '',
            project_statement: '',
        },
        {
            first_name: 'Valerie',
            last_name: 'Brisby',
            email: 'vbrisb@aol.com',
            password: 'wilson',
            eam_short_name: 'sjbo',
            headshot_data: fixtures.headshot('hs1'),
            bio: '',
            project_statement: '',
        },
    ];

    donors = [
        {
            first_name: 'Jim',
            last_name: 'Doughrety',
            email: 'jd@aol.com',
            amount: 55.0,
            stripe_token: 'abc',
            team_short_name: 'sjbo',
            volunteer_uuid: '12341234',
        },
        {
            first_name: 'Helen',
            last_name: 'Nye',
            email: 'hneye@aol.com',
            amount: 10,
            stripe_token: 'def',
            team_short_name: 'sjbo',
        },
    ];

    pledges = [
        {
            first_name: 'Renee',
            last_name: 'Raeburn',
            email: 'rr@aol.com',
            amount_per_hour: 10,
            max_per_month: 100,
            volunteer_uuid: null,
            team_short_name: 'sjbo',
        },
        {
            first_name: 'Dennis',
            last_name: 'Lord',
            email: 'dlord@aol.com',
            amount_per_hour: 1,
            max_per_month: 1000,
            volunteer_uuid: null,
            team_short_name: 'sjbo',
        },
        {
            first_name: 'Jacob',
            last_name: 'Lawler',
            email: 'jl@aol.com',
            amount_per_hour: 2.15,
            max_per_month: 500,
            volunteer_uuid: '123123',
            team_short_name: 'sjbo',
        },
        {
            first_name: 'Dani',
            last_name: 'Boehle',
            email: 'db@aol.com',
            amount_per_hour: 1.10,
            max_per_month: 500,
            volunteer_uuid: '123123',
            team_short_name: 'sjbo',
        },
        {
            first_name: 'Frank',
            last_name: 'Boehle',
            email: 'fb@aol.com',
            amount_per_hour: 3,
            max_per_month: 700,
            volunteer_uuid: '123123',
            team_short_name: 'sjbo',
        },
    ];

    hours = [
        {
            user_uuid: '12341234',
            hours: 1.0,
            signature_data: fixtures.signature('sig1'),
            team_short_name: 'sjbo',
            uuid: 'svc10101',
            place: 'Day Camp',
            date: new Date(), supervisor_name: 'Robin Brenner',
        },
        {
            user_uuid: '12341234',
            hours: 3.0,
            signature_data: fixtures.signature('sig1'),
            team_short_name: 'sjbo',
            place: 'Wycroft School After School',
            date: new Date(),
            supervisor_name: 'Dawn V',
        },
        {
            user_uuid: '121212',
            hours: 5.0,
            signature_data: fixtures.signature('sig1'),
            team_short_name: 'sjbo',
            uuid: 'svc10102',
            place: '49th Street Soup Kitchen',
            date: new Date(), supervisor_name: 'Tiger Hsu',
        },
    ];

    approvals = [
        {
            leader_uuid: 'abcd1234',
            service_uuid: 'svc10101',
            signature_data: fixtures.signature('sig1'),
        },
        {
            leader_uuid: 'abcd1234',
            service_uuid: 'svc10102',
            signature_data: fixtures.signature('sig1'),
        },
    ];
}

module.exports = fixtures;
