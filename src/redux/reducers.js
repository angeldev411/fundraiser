import authReducers from './auth/reducers';
import projectReducers from './project/reducers';
import teamReducers from './team/reducers';
import { combineReducers } from 'redux';

export default combineReducers({
    auth: authReducers,
    project: projectReducers,
    team: teamReducers,
});
