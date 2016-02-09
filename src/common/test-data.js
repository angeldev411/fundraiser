export const user = {
    name: 'Adrien Kühn',
    // role: 'super-admin',
    // role: 'project-leader',
    role: 'team-leader',
};

export const project = {
    name: 'Habitat for Humanity',
    slug: 'habitat-for-humanity',
    projectAdminEmail: 'jane.doe@gmail.com',
    teams: [],
    sponsors: [],
};

export const projects = [];

export const team = {
    name: 'York Division',
    uniqid : 'samples',
    slug: 'york-division',
    logo: 'team_logo.png',
    coverImage : 'team_cover.jpg',
    tagline: 'I’ve Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    slogan: 'LOVE + HELP = MONEY FOR THE HOMELESS',
    description: 'I’ve Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat',
    volunteers: [],
    raised : 2500,
    pledge: 150,
    pledgePerHour : 5,
    totalHours: 841,
    totalVolunteers: 553,
    teamLeaderEmail: 'iamtheleader@gmail.com',
};

export const teams = [];

export const volunteer = {
    name: 'Heather Miller',
    slug: 'heather-miller',
    uniqid: 'samples',
    email: 'heather.miler@gmail.com',
    image: 'user.jpg',
    hours: 240,
    goal: 240,
    raised: 264,
    hourPledge: 15,
    sponsors: 141,
    location: 'York, Pa',
    message: 'Personal Message Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. tecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
    team: { null },
    project: { project },
};

export const volunteers = [];

export const sponsor = {
    name: 'Tim Taylor',
    email: 'tim.taylor@gmail.com',
    donations: [],
};

export const donation = {
    hourly: 15,
    cap: 250,
    total: 170,
    member: null,
    team: null,
    date: '2016-02-05',
};

export const sponsors = [];

// Create array of volunteers in team
for (let i=0; i < 10; i++) {
    team.volunteers.push(volunteer);
}

// Create array of volunteers
for (let i=0; i < 10; i++) {
    volunteers.push(volunteer);
}

// Create array of teams in project
for (let i=0; i < 3; i++) {
    project.teams.push(team);
}

// Create array of projects
for (let i=0; i < 10; i++) {
    projects.push(project);
}

// Create array of teams
for (let i=0; i < 10; i++) {
    teams.push(team);
}

// Add team to volunteer
volunteer.team = team;

// Add project to volunteer
volunteer.project = project;

// Add team to donation
donation.team = team;

// Create array of donations in sponsors
for (let i=0; i < 10; i++) {
    sponsor.donations.push(donation);
}

// Create array of sponsors
for (let i=0; i < 10; i++) {
    sponsors.push(sponsor);
}

// Create array of sponsors in project
for (let i=0; i < 10; i++) {
    project.sponsors.push(sponsor);
}
