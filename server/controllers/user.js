'use strict';
const User = require('../models/user');

class userController {
    static checkCredentials(credentials) {
        return User.findByEmail(credentials.email)
        .then((result) => {
            if (result.password === credentials.password) {
                return Promise.resolve(result);
            } else {
                return Promise.reject('invalid username or password');
            }
        });
    }

    static safe(user) {
        return {
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
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
