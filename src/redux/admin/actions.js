import * as actionTypes from './action-types';
import axios from 'axios';
import { API_URL } from '../../common/constants';


export const executedMonthlyPayments = (result) => ({
    type: actionTypes.EXECUTE_MONTHLY_PAYMENTS,
    result,
});

export const executeError = (result) => ({
    type: actionTypes.EXECUTE_ERROR,
    result,
});

export function executeMonthlyPayments() {
    return (dispatch) => {
        return axios.post(
            `${API_URL}/super-admin/execute/monthly/payments`
        )
        .then(
            (response) => {
                dispatch(executedMonthlyPayments(response));
            }
        )
        .catch(
            (errorResponse) => {
                console.error('Couldnt run payment script');
                dispatch(executeError(errorResponse));
            }
        );
    };
}

export const executedResetHours = (result) => ({
    type: actionTypes.EXECUTE_MONTHLY_PAYMENTS,
    result,
});



export function executeResetHours() {
    return (dispatch) => {
        return axios.post(
            `${API_URL}/super-admin/execute/reset/hours`
        )
        .then(
            (response) => {
                dispatch(executedResetHours(response));
            }
        )
        .catch(
            (errorResponse) => {
                console.error('Couldnt run reset hours script');
                dispatch(executeError(errorResponse));
            }
        );
    };
}