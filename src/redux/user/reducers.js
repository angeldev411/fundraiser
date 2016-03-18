import * as actionTypes from './action-types';

const initialState = {};

export default function reducers(state = initialState, action) {
    switch (action.type) {
        case actionTypes.INVITE_USER:
            return {
                ...state,
                user: action.user,
            };
        case actionTypes.INVITE_FAILED:
            return {
                ...state,
                inviteError: action.error,
            };
        case actionTypes.SIGNUP_FAILED:
            return {
                ...state,
                error: action.error,
            };
        case actionTypes.RESET_PASSWORD:
            return {
                ...state,
                user: action.user,
            };
        case actionTypes.RESET_PASSWORD_FAILED:
            return {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
}
