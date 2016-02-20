'use strict';
import User from './model';
import Volunteer from './volunteer/model';
import TeamLeader from './team-leader/model';
import ProjectLeader from './project-leader/model';
import messages from '../messages';
import mailer from '../helpers/mailer';
import Promise from 'bluebird';

class userController {
    static checkCredentials(credentials) {
        return this.getUserWithRoles(credentials)
        .then((user) => {
            if (!user.id) {
                return Promise.reject(messages.login.failed);
            }
            if (user.password === credentials.password) {
                return Promise.resolve(user);
            } else {
                return Promise.reject(messages.login.failed);
            }
        })
        .catch((err) => {
            return Promise.reject(messages.login.failed);
        });
    }

    static getUserWithRoles(credentials) {
        return User.getByEmail(credentials.email)
        .then((results) => {
            if (results.length === 0) {
                return Promise.reject('User not in db');
            }
            const user = results[0];

            if (!user.id) {
                return Promise.reject('User without ID?');
            }

            return User.rolesForUser(user.id)
            .then((rolesResults) => {
                if (rolesResults.length === 0) {
                    return Promise.reject(`User ${credentials.email} has no role?!`);
                }
                user.roles = rolesResults[0];

                return Promise.resolve(user);
            })
            .catch((err) => {
                return Promise.reject(`There was an error getting user with roles: ${err}`);
            });
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

    static invite(email, role, slugIfNeedBe) {
        let Klass;

        switch (role) {
            case 'TeamLeader':
                Klass = TeamLeader;
                break;
            case 'ProjectLeader':
                Klass = ProjectLeader;
                break;
            default:
                Klass = Volunteer;
        }

        return new Klass({
            email,
        }, slugIfNeedBe)
        .then((user) => {
            // TODO : generate token + send email
            return Promise.resolve(user);
        })
        .catch((err) => {
            console.log(err);
            return Promise.reject('User already in DB');
        });
    }

    // @data includes password and invitecode
    static signup(userData) {
        return this.getUserWithRoles(userData)
        .then((results) => {
            let user;

            if (results.length === 0) {
                // Team.invite Volunteer
                // user = gottenBackFromInvite
            } else {
                // user exists in DB, so it has an invite code
                user = results[0];
                if (user.inviteCode === userData.inviteCode) {
                    return User.update(user, userData)
                    .then(/* login */)
                    .then(() => {
                        return Promise.resolve(messages.signup.success);
                    })
                    .catch((err) => {
                        return Promise.reject(messages.signup.error);
                    });
                } else {
                    return Promise.reject(messages.signup.badInviteCode);
                }
            }
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
