import * as actionTypes from './action-types';

const initialState = {};

export default function reducers(state = initialState, action) {
    switch (action.type) {
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
        default:
            return state;
    }
}
