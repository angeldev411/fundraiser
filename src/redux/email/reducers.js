import * as actionTypes from './action-types';

const initialState = {};

export default function reducers(state = initialState, action) {
    switch (action.type) {
        case actionTypes.SEND_EMAIL:
            return {
                ...state,
                email: action.email,
                error: null,
            };
        case actionTypes.SEND_EMAIL_FAIL:
            return {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
}
