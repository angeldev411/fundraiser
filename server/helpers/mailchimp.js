'use strict';
import config from '../config';
import http from 'http';

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

        return this.subscribeUser(config.MAILCHIMP.VOLUNTEERS_LIST_ID, subscriber);
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
        return new Promise((resolve, reject) => {
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

            const request = http.request(options, (res) => {
                res.setEncoding('utf8');
            });

            request.on('error', (error) => {
                console.log('Mailchimp error: ', error.message);
            });

            request.write(subscriber);
            request.end();
            return resolve();
        });
    }
}
