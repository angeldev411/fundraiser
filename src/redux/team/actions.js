import * as actionTypes from './action-types';
import axios from 'axios';
import { API_URL } from '../../common/constants';

export const receivedTeam = (team) => ({
    type: actionTypes.NEW_TEAM,
    team,
});

export const updatedTeam = (team) => ({
    type: actionTypes.UPDATE_TEAM,
    team,
});

export const newTeamFailed = (error) => ({
    type: actionTypes.NEW_TEAM_FAIL,
    error,
});

export const updateTeamFailed = (error) => ({
    type: actionTypes.UPDATE_TEAM_FAIL,
    error,
});

export const receivedTeams = (teams) => ({
    type: actionTypes.GOT_TEAMS,
    teams,
});

export const getFailed = (error) => ({
    type: actionTypes.GET_TEAMS_FAIL,
    error,
});


export function newTeam(name, projectSlug, slug, teamLeaderEmail) {
    return (dispatch) => {
        return axios.post(`${API_URL}/team`, {
            name,
            projectSlug,
            slug,
            teamLeaderEmail,
        })
        .then(
            (response) => {
                dispatch(receivedTeam(response.data));
            }
        )
        .catch(
            (errorResponse) => {
                dispatch(newTeamFailed(errorResponse.data));
            }
        );
    };
}

export function updateTagline(id, team) {
    return (dispatch) => {
        return axios.put(`${API_URL}/team/${id}/tagline`, {
            id,
            team,
        })
        .then(
            (response) => {
                // dispatch(updatedTeam(response.data));
            }
        )
        .catch(
            (errorResponse) => {
                // dispatch(updateTeamFailed(errorResponse.data));
            }
        );
    };
}

export function updateDescription(id, team) {
    return (dispatch) => {
        return axios.put(`${API_URL}/team/${id}/description`, {
            id,
            team,
        })
        .then(
            (response) => {
                // dispatch(updatedTeam(response.data));
            }
        )
        .catch(
            (errorResponse) => {
                // dispatch(updateTeamFailed(errorResponse.data));
            }
        );
    };
}

export function updateTeam(id, name, projectSlug, slug, teamLeaderEmail) {
    return (dispatch) => {
        return axios.put(`${API_URL}/team/${id}`, {
            name,
            projectSlug,
            slug,
            teamLeaderEmail,
        })
        .then(
            (response) => {
                dispatch(updatedTeam(response.data));
            }
        )
        .catch(
            (errorResponse) => {
                dispatch(updateTeamFailed(errorResponse.data));
            }
        );
    };
}

export function getTeam(projectSlug, slug) {
    return (dispatch) => {
        return axios.get(`${API_URL}/team/${projectSlug}/${slug}`)
        .then(
            (response) => {
                dispatch(receivedTeam(response.data));
            }
        )
        .catch(
            (errorResponse) => {
                dispatch(newTeamFailed('Team not found'));
            }
        );
    };
}

export function indexTeams(projectSlug) {
    return (dispatch) => {
        return axios.get(`${API_URL}/team/${projectSlug}`)
        .then(
            (response) => {
                dispatch(receivedTeams(response.data));
            }
        )
        .catch(
            (errorResponse) => {
                dispatch(getFailed(errorResponse.data));
            }
        );
    };
}
