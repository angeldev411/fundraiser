import * as actionTypes from './action-types';

export const setLoading = function setLoading(bool) {
    return {
        type: actionTypes.LOADING,
        isLoading: bool
    }
}

/* Add new actions here */
export const showHello = function showHello(showOrNot) {
    return {
        type: actionTypes.SHOW_HELLO,
        showHello: showOrNot
    }
}
