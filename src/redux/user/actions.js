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

export const passwordReseted = (user) => ({
    type: actionTypes.RESET_PASSWORD,
    user,
});

export const passwordResetFailed = (error) => ({
    type: actionTypes.RESET_PASSWORD_FAILED,
    error,
});

export const passwordResetRequest = (user) => ({
    type: actionTypes.RESET_PASSWORD_REQUEST,
    user,
});

export const passwordResetRequestFailed = (error) => ({
    type: actionTypes.RESET_PASSWORD_REQUEST_FAILED,
    error,
});

export function invite() {
    return (dispatch) => {
        dispatch(inviteFailed(''));
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
        dispatch(signupFailed(''));
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

export function requestPasswordReset(email) {
    return (dispatch) => {
        dispatch(passwordResetFailed(''));
        return axios.post(
            `${API_URL}/user/reset-password`,
            email
        )
        .then(
            (response) => {
                dispatch(passwordResetRequest(response.data));
            }
        )
        .catch(
            (errorResponse) => {
                dispatch(passwordResetRequestFailed(errorResponse.data));
            }
        );
    };
}

export function resetPassword(data) {
    return (dispatch) => {
        dispatch(passwordResetFailed(''));
        return axios.put(
            `${API_URL}/user/reset-password`,
            data
        )
        .then(
            (response) => {
                dispatch(passwordReseted(response.data));
            }
        )
        .catch(
            (errorResponse) => {
                dispatch(passwordResetFailed(errorResponse.data));
            }
        );
    };
}
