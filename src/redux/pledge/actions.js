import * as actionTypes from './action-types';
import axios from 'axios';
import { API_URL } from '../../common/constants';

export const receivedPledge = (project) => ({
    type: actionTypes.NEW_PLEDGE,
    pledge,
});

export const newPledgeFailed = (error) => ({
    type: actionTypes.NEW_PLEDGE_FAIL,
    error,
});

export function newPledge(firstName, lastName, email, hourly, amount, teamSlug, volunteerSlug, stripeToken = null) {
    return (dispatch) => {
        if (teamSlug) {
            return axios.post(`${API_URL}/sponsor/team/${teamSlug}`, {
                hourly,
                amount,
                email,
                firstName,
                lastName,
                stripeToken,
            })
            .then(
                (response) => {
                    dispatch(receivedPledge(response.data));
                }
            )
            .catch(
                (errorResponse) => {
                    dispatch(newPledgeFailed(errorResponse.data));
                }
            );
        } else if (volunteerSlug) {
            return axios.post(`${API_URL}/sponsor/volunteer/${volunteerSlug}`, {
                hourly,
                amount,
                email,
                firstName,
                lastName,
                stripeToken,
            })
            .then(
                (response) => {
                    dispatch(receivedPledge(response.data));
                }
            )
            .catch(
                (errorResponse) => {
                    dispatch(newPledgeFailed(errorResponse.data));
                }
            );
        }
    };
}
