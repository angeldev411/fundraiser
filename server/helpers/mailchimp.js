'use strict';
import config from '../config';
import http from 'http';
import crypto from 'crypto';
import Volunteer from '../user/volunteer/model';
import TeamLeader from '../user/team-leader/model';

export default class Mailchimp {

    /* ---- VOLUNTEERS ---- */
    static subscribeVolunteer(volunteer) {
        return this.getVolunteerData(volunteer)
        .then((result) => {
            const lastVolunteerDate = result.lastVolunteerDate ? { LASTVOLDAT: new Date(result.lastVolunteerDate) } : null;
            const subscriber = JSON.stringify({
                email_address: volunteer.email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: volunteer.firstName,
                    LNAME: volunteer.lastName,
                    TOTALHOURS: volunteer.totalHours,
                    RAISED: volunteer.raised,
                    PROJECT: result.project.name,
                    TEAM: result.team.name,
                    SIGNUPDATE: new Date(volunteer.created),
                    ...lastVolunteerDate,
                },
            });

            return this.subscribeUser(config.MAILCHIMP.VOLUNTEERS_LIST_ID, subscriber);
        })
        .then((response) => {
            Promise.resolve();
        })
        .catch((err) => {
            Promise.reject(err);
        });
    }

    static updateVolunteer(newVolunteer, oldVolunteer = null) {
        return this.getVolunteerData(newVolunteer)
        .then((result) => {
            const lastVolunteerDate = result.lastVolunteerDate ? { LASTVOLDAT: new Date(result.lastVolunteerDate) } : null;
            const subscriber = JSON.stringify({
                email_address: newVolunteer.email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: newVolunteer.firstName,
                    LNAME: newVolunteer.lastName,
                    TOTALHOURS: newVolunteer.totalHours,
                    RAISED: newVolunteer.raised,
                    PROJECT: result.project.name,
                    TEAM: result.team.name,
                    SIGNUPDATE: new Date(newVolunteer.created),
                    ...lastVolunteerDate,
                },
            });

            if (oldVolunteer && newVolunteer.email !== oldVolunteer.email) { // Email has changed
                return Promise.all([
                    this.unsubscribeUser(config.MAILCHIMP.VOLUNTEERS_LIST_ID, oldVolunteer.email),
                    this.subscribeUser(config.MAILCHIMP.VOLUNTEERS_LIST_ID, subscriber),
                ]);
            } else {
                return this.updateUser(config.MAILCHIMP.VOLUNTEERS_LIST_ID, subscriber, newVolunteer.email);
            }
        })
        .then((response) => {
            return Promise.resolve();
        })
        .catch((err) => {
            return Promise.reject();
        });
    }

    static getVolunteerData(volunteer) {
        let data;

        return Volunteer.getTeamAndProject(volunteer)
        .then((result) => {
            data = result;

            return Volunteer.getLastVolunteerDate(volunteer)
            .then((lastVolunteerDate) => {
                data.lastVolunteerDate = lastVolunteerDate.date;
                return Promise.resolve(data);
            })
            .catch((err) => {
                // Volunteer never volunteered
                return Promise.resolve(data);
            });
        })
        .catch((err) => {
            return Promise.reject(err);
        });
    }

    /* ---- SPONSORS ---- */

    static subscribeSponsor(sponsor) {
        const subscriber = JSON.stringify({
            email_address: sponsor.email,
            status: 'subscribed',
            merge_fields: {
                FNAME: sponsor.firstName,
                LNAME: sponsor.lastName,
            },
        });

        return this.subscribeUser(config.MAILCHIMP.SPONSOR_LIST_ID, subscriber);
    }

    /* ---- TEAMLEADER ---- */

    static subscribeTeamLeader(teamLeader) {
        return TeamLeader.getTeamAndProject(teamLeader)
        .then((result) => {
            const subscriber = JSON.stringify({
                email_address: teamLeader.email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: teamLeader.firstName,
                    LNAME: teamLeader.lastName,
                    TOTALVOL: result.team.totalVolunteers,
                    TOTALHOURS: result.team.totalHours,
                    RAISED: result.team.totalRaised,
                },
            });

            return this.subscribeUser(config.MAILCHIMP.TEAMLEADER_LIST_ID, subscriber);
        })
        .then((response) => {
            return Promise.resolve();
        })
        .catch((err) => {
            return Promise.reject();
        });
    }

    static updateTeamLeader(newTeamLeader, oldTeamLeader = null) {
        return TeamLeader.getTeamAndProject(newTeamLeader)
        .then((result) => {
            const subscriber = JSON.stringify({
                email_address: newTeamLeader.email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: newTeamLeader.firstName,
                    LNAME: newTeamLeader.lastName,
                    TOTALVOL: result.team.totalVolunteers,
                    TOTALHOURS: result.team.totalHours,
                    RAISED: result.team.totalRaised,
                },
            });
            if (oldTeamLeader && newTeamLeader.email !== oldTeamLeader.email) { // Email has changed
                return Promise.all([
                    this.unsubscribeUser(config.MAILCHIMP.TEAMLEADER_LIST_ID, oldTeamLeader.email),
                    this.subscribeUser(config.MAILCHIMP.TEAMLEADER_LIST_ID, subscriber),
                ]);
            } else {
                // if it is a fake teamleader (no email address) don't run this
                if (newTeamLeader.email) return this.updateUser(config.MAILCHIMP.TEAMLEADER_LIST_ID, subscriber, newTeamLeader.email);
            }
        })
        .then((response) => {
            return Promise.resolve();
        })
        .catch((err) => {
            return Promise.reject(err);
        });
    }

    /* ---- COMMONS ---- */

    static subscribeUser(list, subscriber) {
        const options = {
            host: 'us11.api.mailchimp.com',
            path: `/3.0/lists/${list}/members`,
            method: 'POST',
            headers: {
                Authorization: `raiserve ${config.MAILCHIMP.API_KEY}`,
                'Content-Type': 'application/json',
                'Content-Length': subscriber.length,
            },
        };

        return this.sendRequest(options, subscriber)
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch((err) => {
            console.log('MC error:', err);
            return Promise.reject(err);
        });
    }

    static unsubscribeUser(list, email) {
        const subscriberHash = crypto.createHash('md5').update(email).digest('hex');

        const options = {
            host: 'us11.api.mailchimp.com',
            path: `/3.0/lists/${list}/members/${subscriberHash}`,
            method: 'DELETE',
            headers: {
                Authorization: `raiserve ${config.MAILCHIMP.API_KEY}`,
                'Content-Type': 'application/json',
                'Content-Length': email.length,
            },
        };

        return this.sendRequest(options, email)
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
    }

    static updateUser(list, subscriber, email) {
        const subscriberHash = crypto.createHash('md5').update(email).digest('hex');

        const options = {
            host: 'us11.api.mailchimp.com',
            path: `/3.0/lists/${list}/members/${subscriberHash}`,
            method: 'PUT',
            headers: {
                Authorization: `raiserve ${config.MAILCHIMP.API_KEY}`,
                'Content-Type': 'application/json',
                'Content-Length': subscriber.length,
            },
        };

        return this.sendRequest(options, subscriber)
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
    }

    static sendRequest(options, data) {
        return new Promise((resolve, reject) => {
            const callback = (response) => {
                let str = '';

                response.on('data', (chunk) => {
                    str += chunk;
                });

                response.on('error', (error) => {
                    console.log('Mailchimp error: ', error.message);
                    return reject(error.message);
                });

                response.on('end', () => {
                    return resolve(str);
                });
            };

            const request = http.request(options, callback);

            request.write(data);
            request.end();
        });
    }
}
