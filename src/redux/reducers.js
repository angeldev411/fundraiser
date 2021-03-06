import authReducers from './auth/reducers';
import projectReducers from './project/reducers';
import teamReducers from './team/reducers';
import userReducers from './user/reducers';
import volunteerReducers from './volunteer/reducers';
import sponsorReducers from './sponsor/reducers';
import pledgeReducers from './pledge/reducers';
import emailReducers from './email/reducers';
import adminReducers from './admin/reducers';
import { combineReducers } from 'redux';

// App Wide reducer
import * as actionTypes from './action-types';
const initialState = {};

export function reducers(state = initialState, action) {
    switch (action.type) {
        case actionTypes.LOADING:
            return {
                ...state,
                loading: action.isLoading,
            };
        default:
            return state;
    }
}

export default combineReducers({
    app: reducers,
    auth: authReducers,
    project: projectReducers,
    team: teamReducers,
    user: userReducers,
    volunteer: volunteerReducers,
    sponsor: sponsorReducers,
    pledge: pledgeReducers,
    email: emailReducers,
    admin: adminReducers
});
