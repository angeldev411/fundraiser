import * as actionTypes from './action-types';
import axios from 'axios';
import { API_URL } from '../../common/constants';


export const executedMonthlyPayments = (user) => ({
    type: actionTypes.EXECUTE_MONTHLY_PAYMENTS,
    user,
});


export function executeMonthlyPayments() {
    return (dispatch) => {
        return axios.post(
            `${API_URL}/super-admin/execute/monthly/payments`
        )
        .then(
            (response) => {
                console.log(response);
                // dispatch(loggedout());
            }
        )
        .catch(
            (errorResponse) => {
                console.error('Couldnt run payment script');
                // dispatch(loggedout());
            }
        );
    };
}