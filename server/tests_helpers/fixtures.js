'use strict';
import DataURI from 'datauri';

const signature = (name = 'sig1') => new DataURI(`${__dirname}/files/images/signatures/${name}.png`);

const fixtures = {
    superAdmins: [
        {
            email: 'admin@raiserve.org',
            password: 'admin',
            firstName: 'SuperAdmin',
            lastName: 'raiserve.org',
        },
    ],

    teamLeaders: [
        {
            email: 'team-leader@gmail.com',
            password: 'testtesttest',
            firstName: 'team',
            lastName: 'leader',
        },
        {
            email: 'team-leader-totla@gmail.com',
            password: 'testtesttest',
            firstName: 'Tot',
            lastName: 'La',
        },
        {
            email: 'team-leader-totmtl@gmail.com',
            password: 'testtesttest',
            firstName: 'Tot',
            lastName: 'MTL',
        },
    ],

    projectLeaders: [
        {
            email: 'project-leader@gmail.com',
            password: 'testtesttest',
            firstName: 'project',
            lastName: 'leader',
        },
    ],

    projects: [
        {
            name: 'Buildon',
            slug: 'bo',
            shortDescription: 'build schools for your dollars I’ve Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
            projectLeaderEmail: 'project-leader2@gmail.com',
        },
        {
            name: 'Toys for Tots',
            slug: 't4t',
            shortDescription: 'Bring toys to the tots I’ve Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
            projectLeaderEmail: 'project-leader1@gmail.com',
        },
    ],

    teams: [
        {
            name: `St. John's BuildOn NYC`,
            slug: 'sjbo',
            id: 'samples',
            tagline: 'I’ve Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            slogan: 'MONEY FOR THE HOMELESS',
            description: 'I’ve Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat',
        },
        {
            name: 'Toy for tots LA',
            slug: 'totla',
        },
        {
            name: 'Toy for tots MTL',
            slug: 'totmtl',
        },
    ],

    volunteers: [
        {
            id: 'iamapredefinedId',
            firstName: 'Wilson',
            lastName: 'Chen',
            slug: 'wilson-chen',
            email: 'adrien.kuhn+wilson@osedea.com',
            password: 'wilson',
            goal: 30,
            description: 'Born on the west coast. Going to school on the east coast',
        },
        {
            id: 'samples',
            firstName: 'Heather',
            lastName: 'Miller',
            slug: 'heather-miller',
            password: 'wilson',
            email: 'adrien.kuhn+heather@osedea.com',
            goal: 50,
            location: 'York, Pa',
            description: 'Personal Message Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. tecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
        },
        {
            firstName: 'Kathy',
            lastName: 'Simmons',
            slug: 'kathy-simmons',
            email: 'adrien.kuhn+ksim@osedea.com',
            password: 'wilson',
            goal: 15,
            description: '',
        },
        {
            firstName: 'Henry',
            lastName: 'Stevens',
            email: 'adrien.kuhn+hst@osedea.com',
            password: 'wilson',
            goal: 240,
            description: '',
        },
        {
            firstName: 'Owen',
            lastName: 'Stein',
            email: 'adrien.kuhn+oste@osedea.com',
            password: 'wilson',
            description: '',
        },
        {
            firstName: 'Jules',
            lastName: 'Shen',
            email: 'adrien.kuhn+jshe@osedea.com',
            password: 'wilson',
            description: '',
        },
        {
            firstName: 'Kendra',
            lastName: 'Li',
            email: 'adrien.kuhn+kli@osedea.com',
            password: 'wilson',
            description: '',
        },
        {
            firstName: 'Neha',
            lastName: 'Gartner',
            email: 'adrien.kuhn+ng@osedea.com',
            password: 'wilson',
            description: '',
        },
        {
            firstName: 'Valerie',
            lastName: 'Brisby',
            email: 'adrien.kuhn+vbrisb@osedea.com',
            password: 'wilson',
            description: '',
        },
    ],

    invite: {
        email: 'ad@ad.com',
        role: 'TEAM_LEADER',
    },

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

    sponsors : [
        {
            firstName: 'Renee',
            lastName: 'Raeburn',
            email: 'rr@aol.com',
            volunteerLastBilling: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime(), // First day of month timestamp
            teamLastBilling: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime(), // First day of month timestamp
        },
        {
            firstName: 'Dennis',
            lastName: 'Lord',
            email: 'dlord@aol.com',
            volunteerLastBilling: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime(), // First day of month timestamp
            teamLastBilling: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime(), // First day of month timestamp
        },
        {
            firstName: 'Jacob',
            lastName: 'Lawler',
            email: 'jl@aol.com',
            volunteerLastBilling: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime(), // First day of month timestamp
            teamLastBilling: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime(), // First day of month timestamp
        },
        {
            firstName: 'Dani',
            lastName: 'Boehle',
            email: 'db@aol.com',
            volunteerLastBilling: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime(), // First day of month timestamp
            teamLastBilling: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime(), // First day of month timestamp
        },
        {
            firstName: 'Frank',
            lastName: 'Sinatra',
            email: 'fs@aol.com',
            volunteerLastBilling: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime(), // First day of month timestamp
            teamLastBilling: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime(), // First day of month timestamp
        },
        {
            email: 'rr@aol.com',
        },
        {
            email: 'dlord@aol.com',
        },
        {
            email: 'jl@aol.com',
        },
        {
            email: 'db@aol.com',
        },
        {
            email: 'fs@aol.com',
        },
    ],

    pledges : [
        {
            amount: 2,
        },
        {
            amount: 4,
        },
        {
            amount: 5,
        },
        {
            amount: 1,
        },
        {
            amount: 8,
        },
        {
            hourly: 2,
            maxCap: 20,
        },
        {
            hourly: 4,
            maxCap: 200,
        },
        {
            hourly: 5,
            maxCap: 1000,
        },
        {
            hourly: 1,
            maxCap: 500,
        },
        {
            hourly: 8,
            maxCap: 150,
        },
    ],

    hours : [
        {
            hours: 9,
            signature: signature('sig1').content,
            place: 'Day Camp',
            date: '2016-04-05',
            dateTimestamp: new Date('2016-04-05').getTime(),
            supervisor_name: 'Robin Brenner',
        },
        {
            hours: 5,
            signature: signature('sig1').content,
            place: 'Wycroft School After School',
            date: '2016-04-10',
            dateTimestamp: new Date('2016-04-10').getTime(),
            supervisor_name: 'Dawn V',
        },
        {
            hours: 12,
            signature: signature('sig1').content,
            place: '49th Street Soup Kitchen',
            date: '2016-04-12',
            dateTimestamp: new Date('2016-04-12').getTime(),
            supervisor_name: 'Tiger Hsu',
        },
        {
            hours: 6,
            signature: signature('sig1').content,
            place: 'Day Camp',
            date: '2016-04-18',
            dateTimestamp: new Date('2016-04-18').getTime(),
            supervisor_name: 'Robin Brenner',
        },
        {
            hours: 2,
            signature: signature('sig1').content,
            place: 'Wycroft School After School',
            date: '2016-04-20',
            dateTimestamp: new Date('2016-04-20').getTime(),
            supervisor_name: 'Dawn V',
        },
        {
            hours: 10,
            signature: signature('sig1').content,
            place: '49th Street Soup Kitchen',
            date: '2016-04-24',
            dateTimestamp: new Date('2016-04-24').getTime(),
            supervisor_name: 'Tiger Hsu',
        },
        {
            hours: 13,
            signature: signature('sig1').content,
            place: 'Day Camp',
            date: '2016-04-25',
            dateTimestamp: new Date('2016-04-25').getTime(),
            supervisor_name: 'Robin Brenner',
        },
        {
            hours: 7,
            signature: signature('sig1').content,
            place: 'Wycroft School After School',
            date: '2016-04-27',
            dateTimestamp: new Date('2016-04-27').getTime(),
            supervisor_name: 'Dawn V',
        },
        {
            hours: 12,
            signature: signature('sig1').content,
            place: '49th Street Soup Kitchen',
            date: '2016-04-28',
            dateTimestamp: new Date('2016-04-28').getTime(),
            supervisor_name: 'Tiger Hsu',
        },
    ],

    testProject : {
        name: 'TEST PROJECT',
        slug: 'test-project',
        shortDescription: 'Bring toys to the tots I’ve Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
    },

    testTeam: {
        name: 'Test Team',
        slug: 'test-team',
        projectSlug: 'bo',
    },

    testSponsor : {
        firstName: 'Test',
        lastName: 'Sponsor',
        email: 'test-sponsor@test.com',
        hourly: 10,
        cap: 100,
        maxCap: 100,
        cc: '4242424242424242',
        cvv: '123',
        expiration: '12/18',
    },

};

export default fixtures;
