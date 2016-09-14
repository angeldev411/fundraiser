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
        dispatch(newTeamFailed(''));
        return axios.post(`${API_URL}/team`, {
            name,
            projectSlug,
            slug,
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

export function updateTeam(id, team, projectSlug) {
    return (dispatch) => {
        dispatch(updateTeamFailed(''));
        return axios.put(`${API_URL}/team/${id}`, {
            team,
            projectSlug,
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

// INVITING LEADERS

export const invitedLeader = ( newLeader ) => ({
  type: actionTypes.INVITED_LEADER,
  newLeader
});

export const inviteLeaderFailed = ( inviteError ) => ({
  type: actionTypes.INVITE_LEADER_FAILED,
  inviteError
}); 

export function inviteLeader(slug, leader) {
  return (dispatch) => {
    return axios.post(`${API_URL}/team/${slug}/invite-leader`, leader )
    .then( response => dispatch(invitedLeader(response.data)) )
    .catch( error   => dispatch(inviteLeaderFailed(error.data)) );
  }
}

// REMOVING LEADERS
export const removedLeader = ( removedLeader ) => ({
  type: actionTypes.REMOVED_LEADER,
  removedLeader
});

export const removeLeaderFail = ( removeLeaderError ) => ({
  type: actionTypes.REMOVE_LEADER_FAILED,
  removeLeaderError
});

export function removeLeader(teamId, leaderId) {
  return (dispatch) => axios.delete(`${API_URL}/team/${teamId}/leaders/${leaderId}`)
  .then( response => dispatch( removedLeader(response.data) ) )
  .catch( error   => dispatch( removeLeaderFail(error.data) ) );
}

// GET LEADER LIST

export const teamLeaders = ( leaders ) => ({
  type: actionTypes.TEAM_LEADERS,
  leaders
});

export const teamLeadersFail = ( leadersError ) => ({
  type: actionTypes.TEAM_LEADERS_FAILED,
  leadersError
});

export function getLeaders(id) {
  return (dispatch) => axios.get(`${API_URL}/team/${id}/leaders`)
  .then( leaders  => dispatch( teamLeaders(leaders.data) ) )
  .catch( error   => dispatch( teamLeadersFail(error.data) ) );
}

export function getTeam(projectSlug, slug) {
    return (dispatch) => {
        return axios.get(`${API_URL}/team/${projectSlug}/${slug}`)
        .then( response => dispatch( receivedTeam(response.data) ))
        .catch( () => dispatch(newTeamFailed('Team not found') ));
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

// GETTING TEAM STATS

export const receivedStats = (stats) => ({
    type: actionTypes.GOT_TEAM_STATS,
    stats,
});

export const getStatsFailed = (statsError) => ({
    type: actionTypes.GET_TEAM_STATS_FAILED,
    statsError,
});

export function getStats() {
    return (dispatch) => {
        return axios.get(`${API_URL}/team/stats`)
        .then(
          (response) => dispatch(receivedStats(response.data))
        )
        .catch(
            (errorResponse) => {
              dispatch(getStatsFailed(errorResponse.data));
            }
        );
    };
}

// REMOVING TEAMS

export const removedTeam = (teams) => ({
    type: actionTypes.REMOVED_TEAM,
    teams,
});

export const removeTeamFailed = (error) => ({
    type: actionTypes.REMOVE_TEAM_FAIL,
    error,
});

export function removeTeam(team) {
    return (dispatch) => {
        dispatch(removeTeamFailed(''));
        return axios.post(`${API_URL}/team/${team.id}`)
        .then(
            (response) => {
                location.reload();
            }
        )
        .catch(
            (errorResponse) => {
                dispatch(getFailed(errorResponse.data));
            }
        );
    };
}

// GETTING TEAM HOUR LOGS

export const hourLogsGet = (hours) => ({
  type: actionTypes.GET_HOURS,
  hours
});

export function getHourLogs() {
  return (dispatch) => {
    return axios.get(`${API_URL}/team/hours`, {})
      .then( response => dispatch( hourLogsGet(response.data) ) )
      .catch( (err) => {
        console.log('Error in team action, getHourLogs:', err);
        return dispatch( hourLogsGet([]) )
      } );
  }
}
