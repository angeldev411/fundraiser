import * as actionTypes from './action-types';

const initialState = {
    showHello: false
}

export default function reducers(state = initialState, action) {
    switch (action.type) {
        case actionTypes.LOADING:
            return {
                ...state,
                loading: action.isLoading
            }
        /* Add new reducers here */
        case actionTypes.SHOW_HELLO:
            return {
                ...state,
                showHello: action.showHello
            }
        default:
            return state;
    }
}
