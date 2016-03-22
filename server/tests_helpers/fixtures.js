'use strict';
import DataURI from 'datauri';
const signature = (name = 'sig1') => new DataURI(`${__dirname}/files/images/signatures/${name}.png`);

const fixtures = {
    superAdmins: [
        {
            email: 'mmmurf@gmail.com',
            password: 'testtesttest',
            hashedPassword: 'a2c96d518f1099a3b6afe29e443340f9f5fdf1289853fc034908444f2bcb8982',
            firstName: 'matt',
            lastName: 'murphy',
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
        {
            email: 'team-leader-totla@gmail.com',
            password: 'testtesttest',
            hashedPassword: 'a2c96d518f1099a3b6afe29e443340f9f5fdf1289853fc034908444f2bcb8982',
            firstName: 'Tot',
            lastName: 'La',
        },
        {
            email: 'team-leader-totmtl@gmail.com',
            password: 'testtesttest',
            hashedPassword: 'a2c96d518f1099a3b6afe29e443340f9f5fdf1289853fc034908444f2bcb8982',
            firstName: 'Tot',
            lastName: 'MTL',
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
            logo: 'team_logo.png',
            coverImage : 'team_cover.jpg',
            tagline: 'I’ve Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            slogan: 'LOVE + HELP = MONEY FOR THE HOMELESS',
            description: 'I’ve Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat',
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
            slug: 'wilson-chen',
            email: 'adrien.kuhn+wilson@osedea.com',
            password: 'wilson',
            goal: 30,
            hashedPassword: '919e680ee460849a74a82614de062bfbbac76bc98a2f692952b5fcb6364e598b',
            description: 'Born on the west coast. Going to school on the east coast',
        },
        {
            id: 'samples',
            firstName: 'Heather',
            lastName: 'Miller',
            slug: 'heather-miller',
            password: 'wilson',
            hashedPassword: '919e680ee460849a74a82614de062bfbbac76bc98a2f692952b5fcb6364e598b',
            email: 'adrien.kuhn+heather@osedea.com',
            image: 'user.jpg',
            goal: 50,
            location: 'York, Pa',
            message: 'Personal Message Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. tecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
        },
        {
            firstName: 'Kathy',
            lastName: 'Simmons',
            slug: 'kathy-simmons',
            email: 'adrien.kuhn+ksim@osedea.com',
            password: 'wilson',
            goal: 15,
            hashedPassword: '919e680ee460849a74a82614de062bfbbac76bc98a2f692952b5fcb6364e598b',
            description: '',
        },
        {
            firstName: 'Henry',
            lastName: 'Stevens',
            slug: 'henry-stevens',
            email: 'adrien.kuhn+hst@osedea.com',
            password: 'wilson',
            goal: 240,
            hashedPassword: '919e680ee460849a74a82614de062bfbbac76bc98a2f692952b5fcb6364e598b',
            description: '',
        },
        {
            firstName: 'Owen',
            lastName: 'Stein',
            slug: 'owen-stein',
            email: 'adrien.kuhn+oste@osedea.com',
            password: 'wilson',
            hashedPassword: '919e680ee460849a74a82614de062bfbbac76bc98a2f692952b5fcb6364e598b',
            description: '',
        },
        {
            firstName: 'Jules',
            lastName: 'Shen',
            slug: 'jules-shen',
            email: 'adrien.kuhn+jshe@osedea.com',
            password: 'wilson',
            hashedPassword: '919e680ee460849a74a82614de062bfbbac76bc98a2f692952b5fcb6364e598b',
            description: '',
        },
        {
            firstName: 'Kendra',
            lastName: 'Li',
            slug: 'kendra-li',
            email: 'adrien.kuhn+kli@osedea.com',
            password: 'wilson',
            hashedPassword: '919e680ee460849a74a82614de062bfbbac76bc98a2f692952b5fcb6364e598b',
            description: '',
        },
        {
            firstName: 'Neha',
            lastName: 'Gartner',
            slug: 'neha-gartner',
            email: 'adrien.kuhn+ng@osedea.com',
            password: 'wilson',
            hashedPassword: '919e680ee460849a74a82614de062bfbbac76bc98a2f692952b5fcb6364e598b',
            description: '',
        },
        {
            firstName: 'Valerie',
            lastName: 'Brisby',
            slug: 'valerie-brisby',
            email: 'adrien.kuhn+vbrisb@osedea.com',
            password: 'wilson',
            hashedPassword: '919e680ee460849a74a82614de062bfbbac76bc98a2f692952b5fcb6364e598b',
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
            lastBilling: new Date().getTime(),
        },
        {
            firstName: 'Dennis',
            lastName: 'Lord',
            email: 'dlord@aol.com',
            lastBilling: new Date().getTime(),
        },
        {
            firstName: 'Jacob',
            lastName: 'Lawler',
            email: 'jl@aol.com',
            lastBilling: new Date().getTime(),
        },
        {
            firstName: 'Dani',
            lastName: 'Boehle',
            email: 'db@aol.com',
            lastBilling: new Date().getTime(),
        },
        {
            firstName: 'Frank',
            lastName: 'Sinatra',
            email: 'fs@aol.com',
            lastBilling: new Date().getTime(),
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
        },
        {
            hourly: 4,
        },
        {
            hourly: 5,
        },
        {
            hourly: 1,
        },
        {
            hourly: 8,
        },
    ],

    hours : [
        {
            hours: 9,
            signature: signature('sig1').content,
            place: 'Day Camp',
            date: '2016-03-05',
            supervisor_name: 'Robin Brenner',
        },
        {
            hours: 5,
            signature: signature('sig1').content,
            place: 'Wycroft School After School',
            date: '2016-03-10',
            supervisor_name: 'Dawn V',
        },
        {
            hours: 12,
            signature: signature('sig1').content,
            place: '49th Street Soup Kitchen',
            date: '2016-03-12',
            supervisor_name: 'Tiger Hsu',
        },
        {
            hours: 6,
            signature: signature('sig1').content,
            place: 'Day Camp',
            date: '2016-03-18',
            supervisor_name: 'Robin Brenner',
        },
        {
            hours: 2,
            signature: signature('sig1').content,
            place: 'Wycroft School After School',
            date: '2016-03-20',
            supervisor_name: 'Dawn V',
        },
        {
            hours: 10,
            signature: signature('sig1').content,
            place: '49th Street Soup Kitchen',
            date: '2016-03-24',
            supervisor_name: 'Tiger Hsu',
        },
        {
            hours: 13,
            signature: signature('sig1').content,
            place: 'Day Camp',
            date: '2016-03-25',
            supervisor_name: 'Robin Brenner',
        },
        {
            hours: 7,
            signature: signature('sig1').content,
            place: 'Wycroft School After School',
            date: '2016-03-27',
            supervisor_name: 'Dawn V',
        },
        {
            hours: 12,
            signature: signature('sig1').content,
            place: '49th Street Soup Kitchen',
            date: '2016-03-28',
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
        cc: '4242424242424242',
        cvv: '123',
        expiration: '12/18',
    },

};

export default fixtures;
