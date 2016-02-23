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

export const createHourLog = (place, hours, date, supervisor, signature) => {
    return (dispatch) => {
        return axios.post(`${API_URL}/volunteer/record_hours`, {
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
