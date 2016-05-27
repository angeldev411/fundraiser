import * as actionTypes from './action-types';

const initialState = {};

export default function reducers(state = initialState, action) {
    switch (action.type) {
        case actionTypes.EXECUTE_MONTHLY_PAYMENTS:
            return {
                ...state,
                reset: action.user,
            };
        default:
            return state;
    }
}
