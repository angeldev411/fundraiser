import authReducers from './auth/reducers';
import projectReducers from './project/reducers';
import { combineReducers } from 'redux';

export default combineReducers({
    auth: authReducers,
    project: projectReducers,
});
