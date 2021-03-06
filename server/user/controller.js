'use strict';
import User from './model';
import Volunteer from './volunteer/model';
import TeamLeader from './team-leader/model';
import ProjectLeader from './project-leader/model';
import messages from '../messages';
import Mailer from '../helpers/mailer';
import * as roles from './roles';
import Promise from 'bluebird';
import * as Constants from '../../src/common/constants';
import _ from 'lodash';

class userController {
  static checkCredentials(credentials) {
    return this.getUserWithRoles(credentials.email)
        .then((user) => {
          if (!user.id) {
            return Promise.reject(messages.login.failed);
          }
          if (user.password === credentials.password) {
            return this.getRequiredSession(user)
                .then((user) => {
                  return Promise.resolve(user);
                })
                .catch((err) => {
                  return Promise.reject(err);
                });
          } else {
            return Promise.reject(new Error(messages.login.failed));
          }
        })
        .catch((err) => {
          return Promise.reject(new Error(messages.login.failed));
        });
  }

  static getRequiredSession(user) {
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
  }

  static getUserWithRoles(emailOrID) {
    let userPromise;

    if (emailOrID.indexOf('@') > 0) {
      userPromise = User.getByEmail(emailOrID.toLowerCase());
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
      ...(typeof user.hourlyPledge !== 'undefined' ? { hourlyPledge: Number(user.hourlyPledge) } : {}),
      ...(typeof user.goal !== 'undefined' ? { goal: user.goal } : {}),
      ...(typeof user.raised !== 'undefined' ? { raised: user.raised } : {}),
      ...(typeof user.location !== 'undefined' ? { location: user.location } : {}),
      ...(typeof user.description !== 'undefined' ? { description: user.description } : {}),
      ...(typeof user.project !== 'undefined' ? { project: user.project } : {}),
      ...(typeof user.team !== 'undefined' ? { team: user.team } : {}),
      ...(typeof user.team !== 'undefined' ? { team: user.team } : {}),
      ...(typeof user.lastUser !== 'undefined' ? { lastUser: this.safe(user.lastUser) } : {})
    };
  }

  static safeArray(users) {
    for (let i = 0; i < users.length; i++) {
      users[i] = this.safe(users[i]);
    }
    return users;
  }


  /*
   * Invites a new user to participate
   * @param {userData} 
   */
  static invite(userData, role, slug = null) {
    let Klass;

    if (typeof userData === "string") userData = { email: userData };  

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

    return new Klass( userData, slug )
    .then((user) => {
      let link;

      if (role === roles.TEAM_LEADER) {
        return TeamLeader.getTeamAndProject(user)
        .then((data) => {
          const project = data.project;
          const team = data.team;

          link = `${Constants.DOMAIN}/${project.slug}/${team.slug}/join?c=${user.inviteCode}&m=${user.email}&r=TEAM_LEADER`;

          return new Promise((resolve, reject) => {
            Mailer.sendInviteEmail(user, link, project, role);
            return resolve(user);
          });
        })
        .catch((err) => {
          console.error(err);
          return Promise.reject(err);
        });

      } else if (role === roles.PROJECT_LEADER) {
        return ProjectLeader.getProject(user)
        .then((project) => {
          link = `${Constants.DOMAIN}/${project.slug}/join?c=${user.inviteCode}&m=${user.email}`;

          return new Promise((resolve, reject) => {
            Mailer.sendInviteEmail(user, link, project, role);
            return resolve(user);
          });
        })
        .catch((err) => {
          console.log(err);
          return Promise.reject(err);
        });
      }
    })
    .catch((err) => {
      return Promise.reject(new Error('User already in DB'));
    });
  }

  // @data includes password and invitecode
  static signup(userData, teamSlug) {
    return this.getUserWithRoles(userData.email)
        .then((user) => {
          // Since existing users will be updated- including the password- from the team join form,
          // and because we don't have a UI for multi-volunteering yet, we need to make sure the
          // signup is either for an invited team/project leader or that they are a sponsor becoming 
          // a volunteer for the first time. 
          const newInvitee = !!user.inviteCode && user.inviteCode === userData.inviteCode;
          const sponsorVolunteering = !userData.inviteCode && _.intersection(user.roles, ['USER','SPONSOR']).length === 2;

          if (newInvitee || sponsorVolunteering) {
            return User.update(user, userData)
              .then( user => sponsorVolunteering ? this.makeVolunteer(user,teamSlug) : user ) 
              .then( () => this.checkCredentials({
                  email: userData.email,
                  password: userData.password
                })
              )
              .then(  user => Promise.resolve(user))
              .catch( err => {
                console.log('Error in user signup:', err);
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
                    password: userData.password
                  });
                })
                .then((dbUser) => {
                  return Promise.resolve(dbUser);
                })
                .then((user) => {
                    return new Promise((resolve, reject) => {
                      Mailer.sendVolunteerSignupNotificationToTeamLeader(user);
                      return resolve(user);
                    });
                })
                .catch((err) => {
                  console.log('Error adding new user:', err);
                  return Promise.reject(messages.signup.error);
                });
          }
          console.log('Unknown error creating user:', err);
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

  static resetPassword(email) {
    return User.resetPassword(email)
        .then((user) => {
          return Promise.resolve(user);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
  }

  static updatePassword(token, password) {
    return User.updatePassword(token, password)
        .then((user) => {
          return Promise.resolve(user);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
  }

  static getProjectRelatedUser(userID, projectSlug) {
    return ProjectLeader.getProjectRelatedUser(userID, projectSlug)
        .then((user) => {
          return Promise.resolve(user);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
  }

  static getTeamRelatedUser(userEmail, teamSlug) {
    return TeamLeader.getTeamRelatedUser(userEmail, teamSlug)
        .then((user) => {
          return Promise.resolve(user);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
  }

  static makeVolunteer(user, teamIdOrSlug) {
    return Volunteer.createSlug(user.firstName, user.lastName) 
    .then( slug => User.makeVolunteer(user, slug, teamIdOrSlug))
    .then( user => Promise.resolve(user) )
    .catch( err => Promise.reject(err) )
  }
}


export default userController;
