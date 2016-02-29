import * as actionTypes from './action-types';

const initialState = {};

export default function reducers(state = initialState, action) {
    switch (action.type) {
        case actionTypes.LIST_SPONSORS:
            return {
                ...state,
                sponsors: action.sponsors,
            };

        case actionTypes.LIST_SPONSORS_FAIL:
            return {
                ...state,
                error: action.error,
            };

        default:
            return state;
    }
}
