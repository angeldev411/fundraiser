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
