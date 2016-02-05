// MARKETING
export const BASE_URL = '/';
export const FOUNDERS = '/founders';
export const RAISERVE_BASICS = '/raiserve-basics';
export const LEGALS = '/terms-and-conditions';
export const STORY = '/story';

// TEAMS
// /!\ If you change :teamSlug to something else,
// be sure to change it also in /server/models/team.js:250
export const TEAM_PROFILE = `/:projectSlug/:teamSlug`;
export const TEAM_SIGNUP = `${TEAM_PROFILE}/join`;
export const VOLUNTEER_PROFILE = `${TEAM_PROFILE}/:volunteerSlug`;

// ADMIN
export const ADMIN_BASE_URL = '/admin';
export const ADMIN_PROJECTS = 'projects';
export const ADMIN_VOLUNTEERS = 'volunteers';

export const getTeamProfileUrl = (projectslug, teamSlug) => {
    return `/${projectslug}/${teamSlug}`;
};

export const getTeamSignupUrl = (projectslug, teamSlug) => {
    return `/${projectslug}/${teamSlug}/join`;
};

export const getVolunteerProfileUrl = (projectslug, teamSlug, volunteerSlug) => {
    return `/${projectslug}/${teamSlug}/${volunteerSlug}`;
};

export const ADMINPROJECTSURL = `${ADMIN_BASE_URL}/${ADMIN_PROJECTS}`;

export const ADMINVOLUNTEERSURL = `${ADMIN_BASE_URL}/${ADMIN_VOLUNTEERS}`;

export const ADMINSPONSORSURL = `${ADMIN_BASE_URL}/${ADMIN_SPONSORS}`;
