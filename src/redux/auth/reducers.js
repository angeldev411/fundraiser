import * as actionTypes from './action-types';

const initialState = {};

export default function reducers(state = initialState, action) {
    switch (action.type) {
        case actionTypes.LOADING:
            return {
                ...state,
                loading: action.isLoading,
            };
        /* Add new reducers here */
        case actionTypes.SIGN_IN:
            return {
                ...state,
                user: action.user,
                signInError: null,
            };
        case actionTypes.SIGN_IN_FAIL:
            return {
                ...state,
                signInError: action.error,
            };
        case actionTypes.LOGOUT:
            return {
                ...state,
                user: null,
            };
        default:
            return state;
    }
}
