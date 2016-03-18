// MARKETING
export const BASE_URL = '/';
export const FOUNDERS = '/founders';
export const RAISERVE_BASICS = '/raiserve-basics';
export const LEGALS = '/terms-and-conditions';
export const STORY = '/story';
export const PRIVACY = '/privacy-policy';
export const PASSWORD_RESET = '/reset-password';


// TEAMS
// /!\ If you change :teamSlug to something else,
// be sure to change it also in /server/team/model.js:250
export const PROJECT_SIGNUP = `/:projectSlug/join`;
export const TEAM_PROFILE = `/:projectSlug/:teamSlug`;
export const TEAM_SIGNUP = `${TEAM_PROFILE}/join`;
export const VOLUNTEER_PROFILE = `${TEAM_PROFILE}/:volunteerSlug`;

// ADMIN
export const ADMIN_BASE_URL = '/admin';
export const REDIRECT_TO_DASHBOARD = '/dashboard';

export const ADMIN_PROJECTS = 'projects';
export const ADMIN_VOLUNTEERS = 'volunteers';
export const ADMIN_SPONSORS = 'sponsors';
export const ADMIN_TEAMS = 'teams';
export const ADMIN_PROJECTS_URL = `${ADMIN_BASE_URL}/${ADMIN_PROJECTS}`;
export const ADMIN_VOLUNTEERS_URL = `${ADMIN_BASE_URL}/${ADMIN_VOLUNTEERS}`;
export const ADMIN_SPONSORS_URL = `${ADMIN_BASE_URL}/${ADMIN_SPONSORS}`;
export const ADMIN_TEAMS_URL = `${ADMIN_BASE_URL}/${ADMIN_TEAMS}`;


export const ADMIN_TEAM_DASHBOARD = 'team';
export const ADMIN_TEAM_PROFILE = `${ADMIN_TEAM_DASHBOARD}/profile`;
export const ADMIN_TEAM_SPONSORS = `${ADMIN_TEAM_DASHBOARD}/sponsors`;
export const ADMIN_TEAM_VOLUNTEERS = `${ADMIN_TEAM_DASHBOARD}/volunteers`;
export const ADMIN_TEAM_DASHBOARD_URL = `${ADMIN_BASE_URL}/${ADMIN_TEAM_DASHBOARD}/`;
export const ADMIN_TEAM_PROFILE_URL = `${ADMIN_BASE_URL}/${ADMIN_TEAM_PROFILE}`;
export const ADMIN_TEAM_SPONSORS_URL = `${ADMIN_BASE_URL}/${ADMIN_TEAM_SPONSORS}/`;
export const ADMIN_TEAM_VOLUNTEERS_URL = `${ADMIN_BASE_URL}/${ADMIN_TEAM_VOLUNTEERS}/`;


export const ADMIN_VOLUNTEER_DASHBOARD = 'volunteer';
export const ADMIN_VOLUNTEER_PROFILE = `${ADMIN_VOLUNTEER_DASHBOARD}/profile`;
export const ADMIN_VOLUNTEER_SPONSORS = `${ADMIN_VOLUNTEER_DASHBOARD}/sponsors`;
export const ADMIN_VOLUNTEER_DASHBOARD_URL = `${ADMIN_BASE_URL}/${ADMIN_VOLUNTEER_DASHBOARD}/`;
export const ADMIN_VOLUNTEER_PROFILE_URL = `${ADMIN_BASE_URL}/${ADMIN_VOLUNTEER_PROFILE}`;
export const ADMIN_VOLUNTEER_SPONSORS_URL = `${ADMIN_BASE_URL}/${ADMIN_VOLUNTEER_SPONSORS}/`;

// PUBLIC
export const getTeamProfileUrl = (projectslug, teamSlug) => (`/${projectslug}/${teamSlug}`);

export const getTeamSignupUrl = (projectslug, teamSlug) => (`/${projectslug}/${teamSlug}/join`);

export const getVolunteerProfileUrl = (projectslug, teamSlug, volunteerSlug) => (`/${projectslug}/${teamSlug}/${volunteerSlug}`);
