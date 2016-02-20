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
