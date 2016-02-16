import authReducers from './auth/reducers';
import { combineReducers } from 'redux';

export default combineReducers({
    auth: authReducers,
});
