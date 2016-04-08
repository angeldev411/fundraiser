import * as actionTypes from './action-types';
import axios from 'axios';
import { API_URL } from '../../common/constants';

export const email = (mail) => ({
    type: actionTypes.SEND_EMAIL,
    email: mail,
});

export const emailFailed = (error) => ({
    type: actionTypes.SEND_EMAIL_FAIL,
    error,
});

export function sendEmail(projectSlug, teamSlug, subject, message, recipients = null) {
    return (dispatch) => {
        dispatch(emailFailed(''));
        return axios.post(
            `${API_URL}/email/${projectSlug}/${teamSlug}`,
            {
                subject,
                message,
                recipients,
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
