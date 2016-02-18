'use strict';
const Project = require('./model');
const messages = require('../messages');

class projectController {
    static store(data) {
        return Project.validateUniqueSlug(data.project)
        .then((project) => {
            return new Project(data);
        })
        .then((p) => {
            return Promise.resolve(p);
        });
    }
}

module.exports = projectController;
