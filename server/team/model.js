typeof 'use strict';
import uuid from 'uuid';
import util from '../helpers/util.js';
import neo4jDB from 'neo4j-simple';
import config from '../config';
import messages from '../messages';
import UserController from '../user/controller';
import utils from '../helpers/util';
import moment from 'moment';
import Volunteer from '../user/volunteer/model';
import _ from 'lodash';

const db = neo4jDB(config.DB_URL);

const Node = db.defineNode({
  label: ['TEAM'],
  schema: {
    id: db.Joi.string().required(),
    name: db.Joi.string().required(),
    slug: db.Joi.string().regex(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/).required(),
    deadline: db.Joi.date().required().max( moment().add(1,'year')._d ),
    logo: db.Joi.string(),
    coverImage : db.Joi.string(),
    tagline: db.Joi.string(),
    slogan: db.Joi.string(),
    description: db.Joi.string(),
    defaultVolunteerDescription: db.Joi.string(),
    raised : db.Joi.number(),
    pledge: db.Joi.number(),
    pledgePerHour : db.Joi.number(),
    currentHours: db.Joi.number(),
    totalHours: db.Joi.number(),
    goal: db.Joi.number().min(1),
    totalVolunteers: db.Joi.number(),
    signatureRequired: db.Joi.boolean(),
    hoursApprovalRequired: db.Joi.boolean()
  }
});

class Team {

  constructor(rawTeamData) {
    return Team.insert(rawTeamData);
  }

  static insert(rawTeamData) {
    const teamData = Team.filter({
      ...(rawTeamData),
      slug: rawTeamData.slug.toLowerCase(),
      id: uuid.v4(),
      goal: 20, // default goal
      deadline: moment().add(1,'month')._d,
      totalVolunteers: 0,
      currentHours: 0,
      totalHours: 0,
      totalSponsors: 0,
      hourlyPledge: 0,
      raised: 0,
      totalRaised: 0
    });

    return Team.validate(teamData)
            .then(() => {
              return Team.uploadImages(teamData)
                    .then(() => {
                      return Team.saveInsert(teamData).catch((error) => {
                        return Promise.reject(error);
                      });
                    })
                    .then((/*result*/) => {
                      return Promise.resolve(teamData);
                    })
                    .catch((error) => {
                      return Promise.reject(error);
                    });
            })
            .catch((error) => {
              console.log(error);
              return Promise.reject(typeof error === 'string' ? error : messages.team.required);
            });
  }
    static update(rawTeamData) {
        const teamData = Team.filter(rawTeamData);
        return Team.validate(teamData)
            .then(() => {
                return Team.saveUpdate(teamData)
                    .then((result) => {
                        return Promise.resolve(result);
                    })
                    .catch((error) => {
                      return Promise.reject(error);
                    });
            })
            .catch((error) => {
              return Promise.reject(typeof error === 'string' ? error : messages.team.required);
            });
  }

  static createFakeLeader(teamId, teamLeaderId) {
    return db.query(`
                CREATE (u:USER:TEAM_LEADER:FAKE_LEADER {id: {teamLeaderId}, firstName: 'Team Leader'})
                RETURN u
            `,
            {},
      {
        teamLeaderId
      }
        ).getResult('u')
        .then((teamLeader) => {
          return db.query(`
                    MATCH (t:TEAM {id: {teamId} }), (u:TEAM_LEADER {id: {teamLeaderId} })
                    CREATE (u)-[:LEAD]->(t)
                `,
                {},
            {
              teamId,
              teamLeaderId: teamLeader.id
            }
            );
        })
        .then(() => {
          return Promise.resolve();
        })
        .catch((err) => {
          return Promise.reject(err);
        });
  }

  static validate(teamData) {
    return Promise.all([
      Team.validateEmail(teamData)
    ]);
  }

  static validateEmail(teamData) {
    if (teamData.teamLeaderEmail && !utils.isEmailValid(teamData.teamLeaderEmail)) {
      return Promise.reject(messages.notEmail);
    }
  }

  static uploadImages(teamData) {
    const imageUploads = [];

    if (teamData.logoImageData) {
      imageUploads.push(Team.uploadLogoImage(teamData));
    }
    if (teamData.coverImageData) {
      imageUploads.push(Team.uploadCoverImage(teamData));
    }
    return Promise.all(imageUploads);
  }

  static filter(teamData) {
    return {
      id: teamData.id,
      name: teamData.name,
      slug: teamData.slug,
      ...(typeof teamData.teamLeaderEmail !== 'undefined' ? { teamLeaderEmail: teamData.teamLeaderEmail } : {}),
      ...(typeof teamData.logoImageData !== 'undefined' ? { logoImageData: teamData.logoImageData } : {}),
      ...(typeof teamData.coverImageData !== 'undefined' ? { coverImageData: teamData.coverImageData } : {}),
      ...(typeof teamData.logo !== 'undefined' ? { logo: teamData.logo } : {}),
      ...(typeof teamData.coverImage !== 'undefined' ? { coverImage : teamData.coverImage } : {}),
      ...(typeof teamData.tagline !== 'undefined' ? { tagline: teamData.tagline } : {}),
      ...(typeof teamData.slogan !== 'undefined' ? { slogan: teamData.slogan } : {}),
      ...(typeof teamData.description !== 'undefined' ? { description: teamData.description } : {}),
      ...(typeof teamData.defaultVolunteerDescription !== 'undefined' ? { defaultVolunteerDescription: teamData.defaultVolunteerDescription } : {}),
      ...(typeof teamData.raised !== 'undefined' ? { raised : teamData.raised } : {}),
      ...(typeof teamData.goal !== 'undefined' ? { goal : teamData.goal } : {}),
      ...(typeof teamData.deadline !== 'undefined' ? { deadline : teamData.deadline } : {}),
      ...(typeof teamData.totalRaised !== 'undefined' ? { totalRaised : teamData.totalRaised } : {}),
      ...(typeof teamData.hourlyPledge !== 'undefined' ? { hourlyPledge : teamData.hourlyPledge } : {}),
      ...(typeof teamData.currentHours !== 'undefined' ? { currentHours: teamData.currentHours } : {}),
      ...(typeof teamData.totalHours !== 'undefined' ? { totalHours: teamData.totalHours } : {}),
      ...(typeof teamData.totalVolunteers !== 'undefined' ? { totalVolunteers: teamData.totalVolunteers } : {}),
      ...(typeof teamData.totalSponsors !== 'undefined' ? { totalSponsors: teamData.totalSponsors } : {}),
      ...(typeof teamData.signatureRequired !== 'undefined' ? { signatureRequired: teamData.signatureRequired } : {}),
      ...(typeof teamData.hoursApprovalRequired !== 'undefined' ? { hoursApprovalRequired: teamData.hoursApprovalRequired } : {}),
      ...(typeof teamData.fakeLeaderId !== 'undefined' ? { fakeLeaderId: teamData.fakeLeaderId } : {}),
    };
  }

  static saveInsert(teamData) {
    const teamNode = new Node(teamData);
    return teamNode.save();
  }

    static saveUpdate(teamData) {
        return db.getNodes([teamData.id]).then((result) => {
          let team = result[0];
          if(parseInt(team.goal) !== parseInt(teamData.goal) && (team.totalRaised > 0 || team.totalSponsors > 0)) {
           return Promise.reject(`Sorry, Goal hours are locked at ${teamData.goal} as you already have sponsors.`);
          }else{
            const teamNode = new Node(_.extend(team, teamData), teamData.id);
            return teamNode.save();
          }
        });
    }

    static linkTeamCreatorAndProject(teamId, currentUserId, projectSlug) {
        return db.query(`
                MATCH (t:TEAM {id: {teamId} }), (u:USER {id: {userId} }), (p:PROJECT {slug: {projectSlug} })
                CREATE (u)-[:CREATOR]->(t)
                CREATE (t)-[:CONTRIBUTE]->(p)
            `,
            {},
      {
        teamId,
        userId: currentUserId,
        projectSlug
      }
        );
  }

  // inviteLeader
  // @param {object} leaderData - user data for the leader: name, email, etc.
  static inviteLeader(leaderData, teamSlug) {
    return UserController.invite(leaderData, 'TEAM_LEADER', teamSlug)
    .then( newLeader  => Promise.resolve(newLeader) )
    .catch( error       => {
      console.error('Error inviting team leader', leaderData);
      console.error(error)
      return Promise.reject( new Error(messages.invite.error));
    });
  }


  static removeLeader(teamId, leaderId) {
    return db.query(`
      MATCH (user:TEAM_LEADER {id:{leaderId}})-[lead:LEAD]->(:TEAM {id:{teamId}})
      REMOVE user:TEAM_LEADER
      DELETE lead
      RETURN user
    `,
    {},
    { leaderId, teamId })
    .getResult('user');
  }

  static getLeaders(id) {
    return db.query(`
      MATCH (leader:TEAM_LEADER)-[:LEAD]->(:TEAM {id:{id}})
      RETURN {
        id:         leader.id,
        firstName:  leader.firstName,
        lastName:   leader.lastName,
        email:      leader.email
      } as leaders
      ORDER BY leader.firstName
    `,
    {},
    { id })
    .getResults('leaders');
  }

  static getByProject(userId, projectSlug) {
    return db.query(`
                MATCH (teams:TEAM)-[:CONTRIBUTE]->(project:PROJECT {slug: {projectSlug}})<-[:LEAD]-(user:PROJECT_LEADER { id: {userId}})
                RETURN teams
            `,
            {},
      {
        userId,
        projectSlug
      }
        )
        .getResults('teams');
  }

  static getBySlugs(projectSlug, teamSlug) {
    return db.query(`
                MATCH (team:TEAM {slug: {teamSlug} })-[:CONTRIBUTE]->(project:PROJECT {slug: {projectSlug}})
                RETURN team
            `,
            {},
      {
        teamSlug,
        projectSlug
      }
        )
        .getResult('team');
  }

  static isTeamLeaderTeamOwner(teamId, teamLeaderId) {
    return db.query(`
                MATCH (t:TEAM {id: {teamId}})<-[:LEAD]-(u:TEAM_LEADER {id: {teamLeaderId}})
                RETURN { team: t, user: u } AS result
            `,
            {},
      {
        teamId,
        teamLeaderId
      }
        ).getResult('result');
  }

  static isTeamLeaderTeamOwnerBySlug(teamSlug, teamLeaderId) {
    return db.query(`
                MATCH (t:TEAM {slug: {teamSlug}})<-[:LEAD]-(u:TEAM_LEADER {id: {teamLeaderId}})
                RETURN { team: t, user: u } AS result
            `,
            {},
      {
        teamSlug,
        teamLeaderId
      }
        ).getResult('result');
  }

  static isProjectLeaderIndirectTeamOwner(teamId, projectLeaderId) {
    return db.query(`
                MATCH (t:TEAM {id: {teamId}})-->(:PROJECT)<--(u:PROJECT_LEADER {id: {projectLeaderId}})
                RETURN { team: t, user: u } AS result
            `,
            {},
      {
        teamId,
        projectLeaderId
      }
        ).getResult('result');
  }

  static uploadLogoImage(obj) {
    if (typeof obj.logoImageData === 'undefined') {
      return Promise.reject('No Logo Image provided');
    }

    return util.uploadRsImage({
      key_prefix: 'teams/',
      uuid: obj.uuid || obj.id,
      image_data: obj.logoImageData
    }, 'logo')
        .then((result) => {
          obj.logoImageData = null;
          obj.logo = `${config.S3.BASE_URL}/${result.key}`;
          return Promise.resolve(obj);
        });
  }

  static uploadCoverImage(obj) {
    if (typeof obj.coverImageData === 'undefined') {
      return Promise.reject('No Logo Image provided');
    }
    return util.uploadRsImage({
      key_prefix: 'teams/',
      uuid: obj.uuid || obj.id,
      image_data: obj.coverImageData
    }, 'cover')
        .then((result) => {
          obj.coverImageData = null;
          obj.coverImage = `${config.S3.BASE_URL}/${result.key}`;
          return Promise.resolve(obj);
        })
        .catch((error) => {
          return Promise.reject(error);
        });
  }

  static getProject(team) {
    return db.query(`
            MATCH (project:PROJECT)<-[:CONTRIBUTE]-(team:TEAM { id: {teamId} })
            RETURN project
            `,
            {},
      {
        teamId: team.id
      }
        ).getResult('project');
  }

  static getHours(teamSlug){
    return db.query(`
      MATCH (TEAM {slug: {teamSlug}})<-[VOLUNTEER]-(vol:USER)-[VOLUNTEERED]->(hour:HOUR)
      RETURN {
        date:             hour.date,
        place:            hour.place,
        hours:            hour.hours,
        approved:         hour.approved,
        supervisorEmail:  hour.supervisorEmail,
        supervisorName:   hour.supervisorName,
        signature_url:    hour.signature_url,
        firstName:        vol.firstName,
        lastName:         vol.lastName
      } as hours
      ORDER by hour.dateTimestamp DESC
    `, {}, { teamSlug })
    .getResults('hours')
    .catch((err) => {
      console.error('Error in Team#getHours', err);
      throw err;
    });
  }

  static getStats(teamSlug) {
      // Query the distinct volunteers and sponsors for the team
      // We'll fetch volunteer stats later to get each of their sponsors,
      // donations, and hours
    return db.query(`
          MATCH (team:TEAM {slug: {teamSlug}})
          MATCH (team)-[r2:VOLUNTEER]-(volunteers:USER)
          OPTIONAL MATCH (team)-[sponsors:DONATED|SUPPORTING]-(USER)
          RETURN team,
                 collect(distinct volunteers) as teamVolunteers,
                 collect(distinct sponsors)   as teamSponsors
        `, {}, { teamSlug })
        .getResult('team', 'teamVolunteers', 'teamSponsors')
        .then((results) => {
          const team        = results.team;
          const volunteers  = results.teamVolunteers;
          const sponsors    = results.teamSponsors;

          // Queue up volunteer stats to be fetched
          var stats = volunteers.map( volunteer => {
            return Volunteer.getStats(volunteer.slug)
              .then( stats => stats )
              .catch( err => {
                console.log(`Error in ${volunteer.slug}`,err);
                return Promise.reject(err);
              });
          });

          // Once all stats are returned, collect and return totals
          return Promise.all(stats).then( stats => {

            // collect totals from our volunteers
            const totals = _(stats).reduce( (total, stat) => {
              total.totalVolunteers++;
              total.totalHours     += stat.totalHours;
              total.totalSponsors  += stat.totalSponsors;
              total.totalRaised    += stat.raised;
              total.totalMaxCap    += stat.maxCap;
              total.totalHourly    += stat.hourly;  
              return total;
            }, {
              totalVolunteers: 0,
              totalHours:      0,
              totalSponsors:   sponsors.length, // start from team sponsor count
              totalRaised:     0,
              totalMaxCap:     0,
              totalHourly:     0 
            });
            // get totals for the team's hourly and one-time donations
            const teamTotals = _(sponsors).reduce( (total, sponsor) => {
              // currently, we can't trust these to be numbers
              total.hourly  += Number(sponsor.hourly) || 0,
              total.oneTime += Number(sponsor.amount) || 0;
              //console.log(total);
              return total;
            },{
              hourly:   0,
              oneTime:  0
            });
            // add total raised by volunteers and total raised specifically for the team
            totals.totalRaised     += totals.totalRaised + team.raised
            totals.maxIfGoalReached = totals.totalMaxCap + team.goal * teamTotals.hourly;

            return totals;
          });

        })
        .catch(err => {
          console.error(err);
          throw err;
        });

  }

  static removeTeam(teamId, userId) {
    return db.query(
            `
            MATCH (team:TEAM {id: {teamId}})-[:CONTRIBUTE]->(:PROJECT)<-[:LEAD]-(:PROJECT_LEADER { id: {userId}})
            SET team:TEAM_DISABLED
            REMOVE team:TEAM
            RETURN team
            `,
            {},
      {
        teamId,
        userId
      }
        )
        .getResult('team');
  }

}

export default Team;
