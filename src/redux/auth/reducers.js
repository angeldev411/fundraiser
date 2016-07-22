import * as actionTypes from './action-types';
import * as authActionTypes from '../auth/action-types';

const initialState = {};

export default function reducers(state = initialState, action) {
    switch (action.type) {
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
        case authActionTypes.USER_TO_VOLUNTEER_SUCCESS:
            return {
                ...state,
                user: action.user
            }
        case authActionTypes.USER_TO_VOLUNTEER_FAILURE:
            return {
                ...state
            }
        default:
            return state;
    }
}
