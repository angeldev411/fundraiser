import * as actionTypes from './action-types';
import axios from 'axios';
import { API_URL } from '../../common/constants';

export const receivedSponsors = (sponsors) => ({
    type: actionTypes.LIST_SPONSORS,
    sponsors,
});

export const indexSponsorsFailed = (error) => ({
    type: actionTypes.LIST_SPONSORS_FAIL,
    error,
});

export function indexSponsors(projectSlug = null, teamSlug = null, volunteerSlug = null) {
    return (dispatch) => {
        let apiRoute = `${API_URL}/sponsor`;

        if (projectSlug && !teamSlug) {
            apiRoute = `${API_URL}/sponsor/${projectSlug}`;
        } else if (teamSlug && !volunteerSlug) {
            apiRoute = `${API_URL}/sponsor/${projectSlug}/${teamSlug}`;
        } else if (volunteerSlug) {
            apiRoute = `${API_URL}/sponsor/${projectSlug}/${teamSlug}/volunteerSlug`;
        }

        return axios.get(apiRoute)
        .then(
            (response) => {
                dispatch(receivedSponsors(response.data));
            }
        )
        .catch(
            (errorResponse) => {
                dispatch(indexSponsorsFailed(errorResponse.data));
            }
        );
    };
}
