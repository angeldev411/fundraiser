import * as actionTypes from './action-types';
import axios from 'axios';
import { API_URL } from '../../common/constants';

export const receivedTeam = (team) => ({
    type: actionTypes.NEW_TEAM,
    team,
});

export const newTeamFailed = (error) => ({
    type: actionTypes.NEW_TEAM_FAIL,
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
