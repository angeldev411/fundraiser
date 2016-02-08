// MARKETING
export const BASE_URL = '/';
export const FOUNDERS = '/founders';
export const RAISERVE_BASICS = '/raiserve-basics';
export const LEGALS = '/terms-and-conditions';
export const STORY = '/story';

// TEAMS
// /!\ If you change :teamSlug to something else,
// be sure to change it also in /server/team/model.js:250
export const TEAM_PROFILE = `/:projectSlug/:teamSlug`;
export const TEAM_SIGNUP = `${TEAM_PROFILE}/join`;
export const VOLUNTEER_PROFILE = `${TEAM_PROFILE}/:volunteerSlug`;

// ADMIN
export const ADMIN_BASE_URL = '/admin';
export const ADMIN_PROJECTS = 'projects';
export const ADMIN_VOLUNTEERS = 'volunteers';
export const ADMIN_SPONSORS = 'sponsors';
export const ADMIN_TEAMS = 'teams';

export const ADMIN_PROJECTS_URL = `${ADMIN_BASE_URL}/${ADMIN_PROJECTS}`;
export const ADMIN_VOLUNTEERS_URL = `${ADMIN_BASE_URL}/${ADMIN_VOLUNTEERS}`;
export const ADMIN_SPONSORS_URL = `${ADMIN_BASE_URL}/${ADMIN_SPONSORS}`;
export const ADMIN_TEAMS_URL = `${ADMIN_BASE_URL}/${ADMIN_TEAMS}`;

// PUBLIC
export const getTeamProfileUrl = (projectslug, teamSlug) => {
    return `/${projectslug}/${teamSlug}`;
};

export const getTeamSignupUrl = (projectslug, teamSlug) => {
    return `/${projectslug}/${teamSlug}/join`;
};

export const getVolunteerProfileUrl = (projectslug, teamSlug, volunteerSlug) => {
    return `/${projectslug}/${teamSlug}/${volunteerSlug}`;
};
