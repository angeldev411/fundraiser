import * as actionTypes from './action-types';

const initialState = {};

export default function reducers(state = initialState, action) {
    switch (action.type) {
        case actionTypes.HOURS_NOT_APPROVED:
            return {
                ...state,
                hoursData: action.hoursData,
            };
        case actionTypes.HOUR_LOG_ON_SUCCESS:
            return {
                ...state,
                hourLogSuccess: action.success,
            };
        case actionTypes.HOUR_LOG_FAIL:
            return {
                ...state,
                hourLogFailure: action.error,
            };
        case actionTypes.GET_HOURS:
            return {
                ...state,
                hourLogsGet: action.hours,
            };
        case actionTypes.VOLUNTEER:
            return {
                ...state,
                volunteer: action.volunteer,
                error: null,
            };
        case actionTypes.VOLUNTEER_ERROR:
            return {
                ...state,
                error: action.error,
            };
        case actionTypes.VOLUNTEERS:
            return {
                ...state,
                volunteers: action.volunteers,
                error: null,
            };
        case actionTypes.TOP_VOLUNTEERS:
            return {
                ...state,
                topVolunteers: action.volunteers,
                error: null,
            };
        case actionTypes.VOLUNTEERS_ERROR:
            return {
                ...state,
                error: action.error,
            };
        case actionTypes.VOLUNTEER_UPDATE_ON_SUCCESS:
            return {
                ...state,
                user: action.user,
            };
        case actionTypes.VOLUNTEER_UPDATE_ON_FAILURE:
            return {
                ...state,
                error: action.error,
            };
        case actionTypes.UNLINK_VOLUNTEERS_SUCCESS:
            return {
                ...state,
                volunteers: action.volunteers,
            };
        case actionTypes.UNLINK_VOLUNTEERS_FAILURE:
            return {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
}
