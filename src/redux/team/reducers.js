import * as actionTypes from './action-types';

const initialState = {};

export default function reducers(state = initialState, action) {
    switch (action.type) {
        case actionTypes.NEW_TEAM:
            return {
                ...state,
                team: action.team,
                error: null,
            };

        case actionTypes.NEW_TEAM_FAIL:
            return {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
}
