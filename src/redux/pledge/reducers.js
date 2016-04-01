import * as actionTypes from './action-types';

const initialState = {};

export default function reducers(state = initialState, action) {
    switch (action.type) {
        case actionTypes.NEW_PLEDGE:
            return {
                ...state,
                pledge: action.pledge,
            };

        case actionTypes.NEW_PLEDGE_FAIL:
            return {
                ...state,
                pledge: null,
                error: action.error,
            };

        default:
            return state;
    }
}
