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

export function indexSponsors() {
    return (dispatch) => {
        return axios.get(`${API_URL}/sponsor`)
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
