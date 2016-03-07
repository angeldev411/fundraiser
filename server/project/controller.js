'use strict';
import Project from './model';
import messages from '../messages';

class projectController {
    static store(data) {
        return new Project(data)
        .then((p) => {
            return Promise.resolve(p);
        });
    }

    static update(data, id) {
        return new Project(data, id)
        .then((p) => {
            return Promise.resolve(p);
        });
    }

    static index() {
        return Project.getProjects()
        .then((projects) => {
            return Promise.resolve(projects);
        });
    }

    static getProject(projectSlug) {
        return Project.getProject(projectSlug)
        .then((project) => {
            return Promise.resolve(project);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
    }
}

module.exports = projectController;
