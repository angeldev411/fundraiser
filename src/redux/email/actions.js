import * as actionTypes from './action-types';
import axios from 'axios';
import { API_URL } from '../../common/constants';

export const email = (email) => ({
    type: actionTypes.SEND_EMAIL,
    email,
});

export const emailFailed = (error) => ({
    type: actionTypes.SEND_EMAIL_FAIL,
    error,
});

export function sendEmail(projectSlug, teamSlug, subject, message) {
    return (dispatch) => {
        return axios.post(
            `${API_URL}/email/${projectSlug}/${teamSlug}`,
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
