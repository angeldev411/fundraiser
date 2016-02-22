import * as actionTypes from './action-types';
import axios from 'axios';
import { API_URL } from '../../common/constants';

export const receivedProject = (project) => ({
    type: actionTypes.NEW_PROJECT,
    project,
});

export const newProjectFailed = (error) => ({
    type: actionTypes.NEW_PROJECT_FAIL,
    error,
});

export const receivedProjects = (projects) => ({
    type: actionTypes.INDEX_PROJECTS,
    projects,
});

export const indexProjectsFailed = (error) => ({
    type: actionTypes.INDEX_PROJECTS_FAIL,
    error,
});

export function newProject(name, slug, shortDescription, projectLeaderEmail) {
    return (dispatch) => {
        return axios.post(`${API_URL}/project`, {
            name,
            slug,
            shortDescription,
            projectLeaderEmail,
        })
        .then(
            (response) => {
                dispatch(receivedProject(response.data));
            }
        )
        .catch(
            (errorResponse) => {
                dispatch(newProjectFailed(errorResponse.data));
            }
        );
    };
}

export function indexProjects() {
    return (dispatch) => {
        return axios.get(`${API_URL}/project`)
        .then(
            (response) => {
                dispatch(receivedProjects(response.data));
            }
        )
        .catch(
            (errorResponse) => {
                console.log(errorResponse);
                dispatch(indexProjectsFailed(errorResponse.data));
            }
        );
    };
}
