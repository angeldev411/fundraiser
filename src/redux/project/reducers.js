import * as actionTypes from './action-types';

const initialState = {};

export default function reducers(state = initialState, action) {
    switch (action.type) {
        case actionTypes.NEW_PROJECT:
            return {
                ...state,
                project: action.project,
            };

        case actionTypes.NEW_PROJECT_FAIL:
            return {
                ...state,
                error: action.error,
            };

        case actionTypes.INDEX_PROJECTS:
            return {
                ...state,
                projects: action.projects,
            };

        case actionTypes.INDEX_PROJECTS_FAIL:
            return {
                ...state,
                error: action.error,
            };

        default:
            return state;
    }
}
