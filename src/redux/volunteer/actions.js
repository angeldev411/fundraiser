import * as actionTypes from './action-types';
import axios from 'axios';
import { API_URL } from '../../common/constants';

export const hourLogSuccess = (success) => ({
    type: actionTypes.HOUR_LOG_ON_SUCCESS,
    success,
});

export const hourLogFailure = (error) => ({
    type: actionTypes.HOUR_LOG_ON_FAIL,
    error,
});

export const hourLogsGet = (hours) => ({
    type: actionTypes.GET_HOURS,
    hours,
});

export const getHourLogs = () => {
    return (dispatch) => {
        return axios.get(`${API_URL}/hours`, {})
        .then(
            (response) => {
                dispatch(hourLogsGet(response.data));
            }
        )
        .catch(
            (errorResponse) => {
                dispatch(hourLogsGet([]));
            }
        );
    };
};

export const createHourLog = (place, hours, date, supervisor, signature) => {
    return (dispatch) => {
        return axios.post(`${API_URL}/volunteer/hours`, {
            place,
            hours,
            date,
            supervisor,
            signature,
        })
        .then(
            (response) => {
                dispatch(hourLogSuccess({
                    place,
                    hours,
                    date,
                    supervisor,
                    signature,
                    id: response.data.id,
                }));
            }
        )
        .catch(
            (errorResponse) => {
                dispatch(hourLogFailure(errorResponse.data));
            }
        );
    };
};

export const gotVolunteer = (volunteer) => ({
    type: actionTypes.VOLUNTEER,
    volunteer,
});

export const getVolunteerError = (error) => ({
    type: actionTypes.VOLUNTEER_ERROR,
    error,
});

export const getVolunteer = (id) => {
    return (dispatch) => {
        return axios.get(`${API_URL}/user/${id}`)
        .then(
            (response) => {
                dispatch(gotVolunteer(response.data));
            }
        )
        .catch(
            (errorResponse) => {
                dispatch(getVolunteerError(errorResponse.data));
            }
        );
    };
};

export const gotVolunteers = (volunteers) => ({
    type: actionTypes.VOLUNTEERS,
    volunteers,
});

export const getVolunteersError = (error) => ({
    type: actionTypes.VOLUNTEERS_ERROR,
    error,
});

export const getVolunteers = (projectSlug = null, teamSlug = null) => {
    return (dispatch) => {
        let apiRoute = `${API_URL}/volunteer`;

        if (projectSlug && !teamSlug) {
            apiRoute = `${API_URL}/volunteer/${projectSlug}`;
        } else if (teamSlug) {
            apiRoute = `${API_URL}/volunteer/${projectSlug}/${teamSlug}`;
        }

        return axios.get(apiRoute)
        .then(
            (response) => {
                dispatch(gotVolunteers(response.data));
            }
        )
        .catch(
            (errorResponse) => {
                dispatch(getVolunteersError(errorResponse.data));
            }
        );
    };
};
