'use strict';
import User from './model';
import Hour from '../hours/model';
import Volunteer from './volunteer/model';
import TeamLeader from './team-leader/model';
import ProjectLeader from './project-leader/model';
import messages from '../messages';
import mailer from '../helpers/mailer';
import * as roles from './roles';
import Promise from 'bluebird';

class userController {
    static checkCredentials(credentials) {
        return this.getUserWithRoles(credentials.email)
        .then((user) => {
            if (!user.id) {
                return Promise.reject(messages.login.failed);
            }
            if (user.password === credentials.password) {
                if (user.roles.indexOf(roles.PROJECT_LEADER) >= 0) {
                    return ProjectLeader.getProject(user)
                    .then((project) => {
                        user.project = project;
                        return Promise.resolve(user);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
                } else if (user.roles.indexOf(roles.TEAM_LEADER) >= 0) {
                    return TeamLeader.getTeamAndProject(user)
                    .then((data) => {
                        user.project = data.project;
                        user.team = data.team;
                        return Promise.resolve(user);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
                } else {
                    return Promise.resolve(user);
                }
            } else {
                return Promise.reject(messages.login.failed);
            }
        })
        .catch((err) => {
            return Promise.reject(messages.login.failed);
        });
    }

    static getUserWithRoles(emailOrID) {
        let userPromise;

        if (emailOrID.indexOf('@') > 0) {
            userPromise = User.getByEmail(emailOrID);
        } else {
            userPromise = User.getByID(emailOrID);
        }
        return userPromise
        .then((user) => {
            if (!user.id) {
                return Promise.reject('User without ID?');
            }

            return User.rolesForUser(user.id)
            .then((rolesResults) => {
                if (rolesResults.length === 0) {
                    return Promise.reject(`User ${email} has no role?!`);
                }
                user.roles = rolesResults[0];

                return Promise.resolve(user);
            })
            .catch((err) => {
                return Promise.reject(`There was an error getting user with roles: ${err}`);
            });
        })
        .catch((err) => {
            return Promise.reject(messages.user.notInDB);
        });
    }

    static getUserWithHours(userId) {
        return User.hoursForUser(userId);
    }

    static safe(user) {
        return {
            ...(user.email ? { email: user.email } : {}),
            ...(user.firstName ? { firstName: user.firstName } : {}),
            ...(user.lastName ? { lastName: user.lastName } : {}),
            ...(user.slug ? { slug: user.slug } : {}),
            ...(user.roles ? { roles: user.roles } : {}),
            ...(user.id ? { id: user.id } : {}),
            ...(user.image ? { image: user.image } : {}),
            ...(user.hours ? { hours: user.hours } : {}),
            ...(user.goal ? { goal: user.goal } : {}),
            ...(user.raised ? { raised: user.raised } : {}),
            ...(user.hourPledge ? { hourPledge: user.hourPledge } : {}),
            ...(user.sponsors ? { sponsors: user.sponsors } : {}),
            ...(user.location ? { location: user.location } : {}),
            ...(user.message ? { message: user.message } : {}),
            ...(user.project ? { project: user.project } : {}),
            ...(user.team ? { team: user.team } : {}),
        };
    }

    static safeArray(users) {
        for (let i = 0; i < users.length; i++) {
            users[i] = this.safe(users[i]);
        }
        return users;
    }

    static invite(email, role, slugIfNeedBe) {
        let Klass;

        switch (role) {
            case roles.TEAM_LEADER:
                Klass = TeamLeader;
                break;
            case roles.PROJECT_LEADER:
                Klass = ProjectLeader;
                break;
            default:
                Klass = Volunteer;
        }

        return new Klass(
            {
                email,
            },
            slugIfNeedBe
        )
        .then((user) => {
            // TODO : generate token + send email
            return Promise.resolve(user);
        })
        .catch((err) => {
            return Promise.reject('User already in DB');
        });
    }

    // @data includes password and invitecode
    static signup(userData, teamSlug) {
        return this.getUserWithRoles(userData.email)
        .then((user) => {
            if (user.inviteCode === userData.inviteCode) {
                return User.update(user, userData)
                .then((userUpdated) => {
                    return Promise.resolve(userUpdated);
                })
                .catch((err) => {
                    return Promise.reject(messages.signup.error);
                });
            } else {
                return Promise.reject(messages.signup.badInviteCode);
            }
        })
        .catch((err) => {
            if (err === messages.user.notInDB) {
                return new Volunteer(userData, teamSlug)
                .then((user) => {
                    return Promise.resolve(user);
                })
                .catch((err) => {
                    return Promise.reject(messages.signup.error);
                });
            }
            return Promise.reject(messages.signup.error);
        });
    }

    static getVolunteer(slug) {
        return Volunteer.getBySlug(slug)
        .then((user) => {
            return Promise.resolve(user);
        })
        .catch((err) => {
            // console.error('[USER CONTROLLER] error:', err);
            return Promise.reject(err);
        });
    }
}

export default userController;
