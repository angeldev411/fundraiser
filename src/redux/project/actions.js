import * as actionTypes from './action-types';
import axios from 'axios';
import { API_URL } from '../../common/constants';

export const receivedProject = (project) => ({
    type: actionTypes.NEW_PROJECT,
    project,
});

export const updatedProject = (project) => ({
    type: actionTypes.UPDATE_PROJECT,
    project,
});

export const newProjectFailed = (error) => ({
    type: actionTypes.NEW_PROJECT_FAIL,
    error,
});

export const updateProjectFailed = (error) => ({
    type: actionTypes.UPDATE_PROJECT_FAIL,
    error,
});

export const receivedProjects = (projects) => ({
    type: actionTypes.LIST_PROJECTS,
    projects,
});

export const indexProjectsFailed = (error) => ({
    type: actionTypes.LIST_PROJECTS_FAIL,
    error,
});

export function newProject(name, slug, shortDescription, projectLeaderEmail) {
    return (dispatch) => {
        dispatch(newProjectFailed(''));
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

export function getProject(projectSlug) {
    return (dispatch) => {
        return axios.get(`${API_URL}/project/${projectSlug}`)
        .then(
            (response) => {
                dispatch(receivedProject(response.data));
            }
        )
        .catch(
            (errorResponse) => {
                dispatch(newProjectFailed('Project not found'));
            }
        );
    };
}

export function updateProject(id, name, slug, shortDescription, projectLeaderEmail) {
    return (dispatch) => {
        dispatch(updateProjectFailed(''));
        return axios.put(`${API_URL}/project/${id}`, {
            name,
            slug,
            shortDescription,
            projectLeaderEmail,
        })
        .then(
            (response) => {
                dispatch(updatedProject(response.data));
            }
        )
        .catch(
            (errorResponse) => {
                dispatch(updateProjectFailed(errorResponse.data));
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
                dispatch(indexProjectsFailed(errorResponse.data));
            }
        );
    };
}

export const hourLogsGet = (hours) => ({
  type: actionTypes.GET_HOURS,
  hours
});

export function getHourLogs() {
  return (dispatch) => {
    return axios.get(`${API_URL}/project/hours`, {})
      .then( response => dispatch( hourLogsGet(response.data) ) )
      .catch( (err) => {
        console.log('Error in project action, getHourLogs:', err);
        return dispatch( hourLogsGet([]) )
      } );
  }
}
