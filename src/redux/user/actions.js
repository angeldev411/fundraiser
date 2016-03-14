import * as actionTypes from './action-types';
import * as AuthActions from '../auth/actions';
import axios from 'axios';
import { API_URL } from '../../common/constants';

export const invited = (user) => ({
    type: actionTypes.INVITE_USER,
    user,
});

export const inviteFailed = (error) => ({
    type: actionTypes.INVITE_FAILED,
    error,
});

export const signupFailed = (error) => ({
    type: actionTypes.SIGNUP_FAILED,
    error,
});

export function invite() {
    return (dispatch) => {
        return axios.post(
            `${API_URL}/user`
        )
        .then(
            (response) => {
                dispatch(invited(response.data));
            }
        )
        .catch(
            (errorResponse) => {
                dispatch(inviteFailed(errorResponse));
            }
        );
    };
}

export function signup(data) {
    return (dispatch) => {
        return axios.post(
            `${API_URL}/signup`,
            data
        )
        .then(
            (response) => {
                dispatch(AuthActions.receivedUser(response.data));
            }
        )
        .catch(
            (errorResponse) => {
                dispatch(signupFailed(errorResponse.data));
            }
        );
    };
}
