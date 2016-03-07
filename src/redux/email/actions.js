import * as actionTypes from './action-types';
import axios from 'axios';
import { API_URL } from '../../common/constants';

export const email = (user) => ({
    type: actionTypes.SEND_EMAIL,
    user,
});

export const emailFailed = (error) => ({
    type: actionTypes.SEND_EMAIL_FAIL,
    error,
});

export function sendEmail(subject, message) {
    return (dispatch) => {
        return axios.post(
            `${API_URL}/email`,
            {
                subject,
                message,
            }
        )
        .then(
            (response) => {
                dispatch(email(response.data));
            }
        )
        .catch(
            (errorResponse) => {
                dispatch(emailFailed(errorResponse.data));
            }
        );
    };
}
