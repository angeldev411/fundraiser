'use strict';
import User from './model';
import messages from '../messages';

class userController {
    static checkCredentials(credentials) {
        return this.getUserWithRoles(credentials)
        .then((user) => {
            if (!user) {
                return Promise.reject(messages.login.failed);
            }
            return Promise.resolve(user);
        });
    }

    static getUserWithRoles(credentials) {
        return User.findByEmail(credentials.email)
        .then((results) => {
            if (results.length === 0) {
                return Promise.resolve(false);
            }
            const user = results[0];

            if (user.password === credentials.password) {
                return User.rolesForUuid(user.uuid)
                .then((roles) => {
                    user.roles = roles;

                    return Promise.resolve(user);
                });
            } else {
                return Promise.resolve(false);
            }
        });
    }

    static safe(user) {
        return {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: user.roles,
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

export default userController;
