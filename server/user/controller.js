'use strict';
import User from './model';
import messages from '../messages';
import mailer from '../helpers/mailer';

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
        return User.getByEmail(credentials.email)
        .then((results) => {
            if (results.length === 0) {
                return Promise.resolve(false);
            }
            const user = results[0];

            if (user.password === credentials.password) {
                return User.rolesForUser(user.id)
                .then((rolesResults) => {
                    user.roles = rolesResults[0];

                    return Promise.resolve(user);
                })
                .catch((err) => {
                    console.log(err);
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
            id: user.id,
        };
    }

    static invite(email) {
        return new User({
            email,
        })
        .then((idObject) => {
            return User.getById(idObject.id);
        })
        .then((users) => {
            if (users.length === 0) {
                Promise.reject('Not in DB');
            }
            // TODO : generate token + send email
            return Promise.resolve(users[0]);
        })
        .catch((err) => {
            console.log(err);
            return Promise.reject('User already in DB');
        });
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
