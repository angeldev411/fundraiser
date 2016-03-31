import * as actionTypes from './action-types';
import axios from 'axios';
import { API_URL } from '../../common/constants';

export const receivedUser = (user) => ({
    type: actionTypes.SIGN_IN,
    user,
});

export const signinFailed = (error) => ({
    type: actionTypes.SIGN_IN_FAIL,
    error,
});

export function signIn(email, password, remember) {
    return (dispatch) => {
        dispatch(signinFailed(''));
        return axios.post(
            `${API_URL}/auth/login`,
            {
                email,
                password,
                remember,
            }
        )
        .then(
            (response) => {
                dispatch(receivedUser(response.data));

                // Redirect to dashboard
                window.location = '/dashboard';
            }
        )
        .catch(
            (errorResponse) => {
                dispatch(signinFailed(errorResponse.data));
            }
        );
    };
}

export const loggedout = () => ({
    type: actionTypes.LOGOUT,
});

export function logout() {
    return (dispatch) => {
        return axios.get(
            `${API_URL}/auth/logout`
        )
        .then(
            (response) => {
                dispatch(loggedout());
            }
        )
        .catch(
            (errorResponse) => {
                console.error('Couldnt log out');
                dispatch(loggedout());
            }
        );
    };
}

export function checkIfLoggedIn() {
    return (dispatch) => {
        return axios.get(
            `${API_URL}/auth/whoami`
        )
        .then(
            (response) => {
                dispatch(receivedUser(response.data));
            }
        )
        .catch(
            (errorResponse) => {
                dispatch(loggedout());
            }
        );
    };
}
