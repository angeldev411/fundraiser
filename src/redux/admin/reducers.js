import * as actionTypes from './action-types';

const initialState = {};

export default function reducers(state = initialState, action) {
    switch (action.type) {
        case actionTypes.EXECUTE_RESET_HOURS:
            return {
                ...state,
                status: action,
            };
        case actionTypes.EXECUTE_MONTHLY_PAYMENTS:
            return {
                ...state,
                status: action,
            };
        case actionTypes.EXECUTE_ERROR:
            return {
                ...state,
                error: action.user,
            };
        default:
            return state;
    }
}
