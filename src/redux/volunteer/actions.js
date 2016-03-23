import * as actionTypes from './action-types';
import axios from 'axios';
import { API_URL } from '../../common/constants';

export const hoursNotApproved = (hoursData) => ({
    type: actionTypes.HOURS_NOT_APPROVED,
    hoursData,
});

export const hourLogSuccess = (success) => ({
    type: actionTypes.HOUR_LOG_ON_SUCCESS,
    success,
});

export const hourLogFailure = (error) => ({
    type: actionTypes.HOUR_LOG_ON_FAIL,
    error,
});

export const volunteerUpdateSuccess = (success) => ({
    type: actionTypes.VOLUNTEER_UPDATE_ON_SUCCESS,
    success,
});

export const volunteerUpdateFailure = (error) => ({
    type: actionTypes.VOLUNTEER_UPDATE_ON_FAILURE,
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

export const createHourLog = (place, hours, date, supervisor, signature, approved) => {
    return (dispatch) => {
        dispatch(hourLogFailure(''));
        return axios.post(`${API_URL}/hours`, {
            place,
            hours,
            date,
            supervisor,
            signature,
            approved,
        })
        .then(
            (response) => {
                dispatch(hourLogSuccess({
                    place,
                    hours,
                    date,
                    supervisor,
                    signature,
                    approved,
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

export const approveHour = (id) => {
    return (dispatch) => {
        return axios.put(`${API_URL}/hours/${id}`, {})
        .then(
            (response) => {
                dispatch(hourLogSuccess());
            }
        )
        .catch(
            (errorResponse) => {
                dispatch(hourLogFailure());
            }
        );
    };
};

export const getHoursNotApproved = (teamId) => {
    return (dispatch) => {
        return axios.get(`${API_URL}/hours-team/${teamId}`, {
            teamId,
        })
        .then(
            (response) => {
                dispatch(hoursNotApproved(
                    response.data
                ));
            }
        );
    };
};

export const updateProfile = (user) => {
    return (dispatch) => {
        const volunteerProfile = user;

        dispatch(volunteerUpdateFailure(''));
        return axios.put(`${API_URL}/volunteer`, volunteerProfile)
        .then(
            (response) => {
                dispatch(volunteerUpdateSuccess(true));
            }
        )
        .catch(
            (errorResponse) => {
                dispatch(volunteerUpdateFailure(false));
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

export const gotTopVolunteers = (volunteers) => ({
    type: actionTypes.TOP_VOLUNTEERS,
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

export const getTopVolunteers = (projectSlug = null, teamSlug = null) => {
    return (dispatch) => {
        return axios.get(`${API_URL}/volunteer/${projectSlug}/${teamSlug}/top`)
        .then(
            (response) => {
                dispatch(gotTopVolunteers(response.data));
            }
        )
        .catch(
            (errorResponse) => {
                dispatch(getVolunteersError(errorResponse.data));
            }
        );
    };
};

export const unlinkVolunteerSuccess = (volunteers) => ({
    type: actionTypes.UNLINK_VOLUNTEERS_SUCCESS,
    volunteers,
});

export const unlinkVolunteerFailure = (error) => ({
    type: actionTypes.UNLINK_VOLUNTEERS_FAILURE,
    error,
});

export const unlinkVolunteers = (volunteers) => {
    return (dispatch) => {
        dispatch(unlinkVolunteerFailure(''));
        return axios.post(`${API_URL}/volunteer`, volunteers)
        .then(
            (response) => {
                location.reload();
            }
        )
        .catch(
            (errorResponse) => {
                dispatch(unlinkVolunteerFailure(errorResponse));
            }
        );
    };
};
