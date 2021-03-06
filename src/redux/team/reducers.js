import * as actionTypes from './action-types';

const initialState = {};

export default function reducers(state = initialState, action) {
    switch (action.type) {
        case actionTypes.NEW_TEAM:
            return {
                ...state,
                team: action.team,
                error: null,
            };

        case actionTypes.NEW_TEAM_FAIL:
            return {
                ...state,
                error: action.error,
            };

        case actionTypes.UPDATE_TEAM:
            return {
                ...state,
                team: action.team,
                error: null,
            };

        case actionTypes.INVITED_LEADER:
            return {
                ...state,
                newLeader: action.newLeader,
                inviteError: null
            }

        case actionTypes.INVITE_LEADER_FAILED:
            return {
                ...state,
                inviteError: action.inviteError
            }

        case actionTypes.REMOVED_LEADER:
            return {
                ...state,
                removedLeader: action.removedLeader
            }

        case actionTypes.REMOVE_LEADER_FAILED:
            return {
                ...state,
                removeLeaderError: action.removeLeaderError
            }

        case actionTypes.TEAM_LEADERS:
            return {
                ...state,
                // reset new and removed leader in 
                // case we're sending an updated list
                newLeader: null,
                removedLeader: null,
                leaders: action.leaders
            }

        case actionTypes.TEAM_LEADERS_FAILED:
            return {
                ...state,
                leadersError: action.leadersError
            }

        case actionTypes.GET_HOURS:
            return {
                ...state,
                hourLogsGet: action.hours,
            };

        case actionTypes.UPDATE_TEAM_FAIL:
            return {
                ...state,
                error: action.error,
            };

        case actionTypes.GOT_TEAMS:
            return {
                ...state,
                teams: action.teams,
                error: null,
            };

        case actionTypes.GET_TEAMS_FAIL:
            return {
                ...state,
                error: action.error,
            };
        case actionTypes.GOT_TEAM_STATS:
            return {
                ...state,
                stats: action.stats,
            };
        case actionTypes.GET_TEAM_STATS_FAILED:
            return {
                ...state,
                statsError: action.statsError,
            };
        case actionTypes.REMOVE_TEAM:
            return {
                ...state,
                teams: action.teams,
            };
        case actionTypes.REMOVE_TEAM_FAIL:
            return {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
}
