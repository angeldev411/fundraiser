import * as ROLES from '../user/roles';

export function isVolunteer(user) {
    return user.roles.indexOf(ROLES.VOLUNTEER) >= 0;
}

export function isTeamLeader(user) {
    return user.roles.indexOf(ROLES.TEAM_LEADER) >= 0;
}

export function isProjectLeader(user) {
    return user.roles.indexOf(ROLES.PROJECT_LEADER) >= 0;
}

export function isSuperAdmin(user) {
    return user.roles.indexOf(ROLES.SUPER_ADMIN) >= 0;
}

export function isLogged(session) {
    return session.user && session.user.roles && session.user.roles.length > 1;
}
