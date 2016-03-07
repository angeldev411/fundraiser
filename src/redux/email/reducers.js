import * as actionTypes from './action-types';

const initialState = {};

export default function reducers(state = initialState, action) {
    switch (action.type) {
        case actionTypes.SEND_EMAIL:
            return {
                ...state,
                email: action.email,
                emailError: null,
            };
        case actionTypes.SEND_EMAIL_FAIL:
            return {
                ...state,
                emailError: action.error,
            };
        default:
            return state;
    }
}
