'use strict';
import User from './model';
import Hour from '../hours/model';
import Volunteer from './volunteer/model';
import TeamLeader from './team-leader/model';
import ProjectLeader from './project-leader/model';
import messages from '../messages';
import Mailer from '../helpers/mailer';
import * as roles from './roles';
import Promise from 'bluebird';
import * as Constants from '../../src/common/constants';

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
                } else if (user.roles.indexOf(roles.VOLUNTEER) >= 0) {
                    return Volunteer.getTeamAndProject(user)
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

    static userOwnsTeam(userId, teamId) {
        return TeamLeader.ownsTeam(userId, teamId);
    }

    static userCanApproveHour(userId, hourId) {
        return TeamLeader.indirectlyOwnsHour(userId, hourId);
    }

    static safe(user) {
        return {
            ...(typeof user.email !== 'undefined' ? { email: user.email } : {}),
            ...(typeof user.firstName !== 'undefined' ? { firstName: user.firstName } : {}),
            ...(typeof user.lastName !== 'undefined' ? { lastName: user.lastName } : {}),
            ...(typeof user.slug !== 'undefined' ? { slug: user.slug } : {}),
            ...(typeof user.roles !== 'undefined' ? { roles: user.roles } : {}),
            ...(typeof user.id !== 'undefined' ? { id: user.id } : {}),
            ...(typeof user.image !== 'undefined' ? { image: user.image } : {}),
            ...(typeof user.currentHours !== 'undefined' ? { currentHours: user.currentHours } : {}),
            ...(typeof user.totalHours !== 'undefined' ? { totalHours: user.totalHours } : {}),
            ...(typeof user.totalSponsors !== 'undefined' ? { totalSponsors: user.totalSponsors } : {}),
            ...(typeof user.goal !== 'undefined' ? { goal: user.goal } : {}),
            ...(typeof user.raised !== 'undefined' ? { raised: user.raised } : {}),
            ...(typeof user.sponsors !== 'undefined' ? { sponsors: user.sponsors } : {}),
            ...(typeof user.location !== 'undefined' ? { location: user.location } : {}),
            ...(typeof user.description !== 'undefined' ? { message: user.description } : {}),
            ...(typeof user.project !== 'undefined' ? { project: user.project } : {}),
            ...(typeof user.team !== 'undefined' ? { team: user.team } : {}),
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
            let link;

            if (role === roles.TEAM_LEADER) {
                return TeamLeader.getTeamAndProject(user)
                .then((data) => {
                    const project = data.project;
                    const team = data.team;

                    link = `${Constants.DOMAIN}/${project.slug}/${team.slug}/join?c=${user.inviteCode}&m=${user.email}`;

                    const content = {
                        subject: 'Welcome to Raiserve',
                        body: link,
                    };

                    return new Promise((resolve, reject) => {
                        Mailer.sendEmail(content, [user], (response) => {
                            return resolve(user);
                        }, (err) => {
                            console.log(err);
                            return reject('Invite email could not be sent');
                        });
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
            } else if (role === roles.PROJECT_LEADER) {
                return ProjectLeader.getProject(user)
                .then((project) => {
                    link = `${Constants.DOMAIN}/${project.slug}/join?c=${user.inviteCode}&m=${user.email}`;

                    const content = {
                        subject: 'Welcome to Raiserve',
                        body: link,
                    };

                    return new Promise((resolve, reject) => {
                        Mailer.sendEmail(content, [user], (response) => {
                            return resolve(user);
                        }, (err) => {
                            console.log(err);
                            return reject('Invite email could not be sent');
                        });
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
            }
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
                    return this.checkCredentials({
                        email: userData.email,
                        password: userData.password,
                    });
                })
                .then((dbUser) => {
                    return Promise.resolve(dbUser);
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
                    return this.checkCredentials({
                        email: userData.email,
                        password: userData.password,
                    });
                })
                .then((dbUser) => {
                    return Promise.resolve(dbUser);
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
