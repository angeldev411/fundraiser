'use strict';
const User = require('./model');
const messages = require('../messages');

class userController {
    static checkCredentials(credentials) {
        return User.findByEmail(credentials.email)
        .then((results) => {
            if (results.length === 0) {
                return Promise.reject(messages.login.failed);
            }
            const result = results[0];

            if (result.password === credentials.password) {
                return Promise.resolve(result);
            } else {
                return Promise.reject(messages.login.failed);
            }
        });
    }

    static safe(user) {
        return {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            uuid: user.uuid,
        };
    }

    // Corporate?
    static createProject(obj) {
        return Project.validate(obj)
        .then(Project.validateUniqueName)
        .then(Project.uploadSplashImage)
        .then(Corporate.insertProjectIntoDb);
    }
}

module.exports = userController;
