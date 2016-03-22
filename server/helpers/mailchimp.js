'use strict';
import config from '../config';
import http from 'http';
import crypto from 'crypto';

export default class Mailchimp {
    static subscribeVolunteer(volunteer) {
        const subscriber = JSON.stringify({
            email_address: volunteer.email,
            status: 'subscribed',
            merge_fields: {
                FNAME: volunteer.firstName,
                LNAME: volunteer.lastName,
            },
        });

        return this.subscribeUser(config.MAILCHIMP.VOLUNTEERS_LIST_ID, subscriber)
        .then((response) => {
            console.log(response);
            Promise.resolve();
        })
        .catch((err) => {
            console.log(err);
            Promise.reject(err);
        });
    }

    static updateVolunteer(oldVolunteer, newVolunteer) {
        const subscriber = JSON.stringify({
            email_address: newVolunteer.email,
            status: 'subscribed',
            merge_fields: {
                FNAME: newVolunteer.firstName,
                LNAME: newVolunteer.lastName,
            },
        });

        return Promise.all([
            this.unsubscribeUser(config.MAILCHIMP.VOLUNTEERS_LIST_ID, oldVolunteer.email),
            this.subscribeUser(config.MAILCHIMP.VOLUNTEERS_LIST_ID, subscriber),
        ])
        .then((response) => {
            return Promise.resolve();
        })
        .catch((err) => {
            return Promise.reject();
        });
    }

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

    static subscribeTeamLeader(teamLeader) {
        const subscriber = JSON.stringify({
            email_address: teamLeader.email,
            status: 'subscribed',
            merge_fields: {
                FNAME: teamLeader.firstName,
                LNAME: teamLeader.lastName,
            },
        });

        return this.subscribeUser(config.MAILCHIMP.TEAMLEADER_LIST_ID, subscriber);
    }

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

    static sendRequest(options, subscriber) {
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

            request.write(subscriber);
            request.end();
        });
    }
}
