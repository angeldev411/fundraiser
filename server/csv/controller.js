'use strict';
import Volunteer from '../user/volunteer/model';
import Sponsor from '../user/sponsor/model';
import Csv from './model';

class csvController {
    static getTeamVolunteers(user) {
        return Volunteer.getVolunteers(user.project.slug, user.team.slug)
        .then((volunteers) => {
            const data = [];

            data.push({
                firstName: 'firstName',
                lastName: 'lastName',
                email: 'email',
                currentHours: 'currentHours',
                goal: 'goal',
                totalHours: 'totalHours',
                totalSponsors: 'totalSponsors',
                raised: 'raised',
                signupDate: 'signupDate',
            });

            volunteers.map((volunteer, i) => {
                data.push({
                    firstName: volunteer.firstName,
                    lastName: volunteer.lastName,
                    email: volunteer.email,
                    currentHours: volunteer.currentHours,
                    goal: volunteer.goal,
                    totalHours: volunteer.totalHours,
                    totalSponsors: volunteer.totalSponsors,
                    raised: volunteer.raised,
                    signupDate: new Date(volunteer.created).toDateString(),
                });
            });

            return data;
        })
        .then((data) => {
            return Csv.generate(data);
        })
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
    }

    static getTeamSponsors(user) {
        return Sponsor.getSponsors(user.project.slug, user.team.slug)
        .then((sponsors) => {
            const data = [];

            data.push({
                firstName: 'firstName',
                lastName: 'lastName',
                email: 'email',

                hourly: 'hourly',
                total: 'total',
                date: 'date',

                slug: 'slug',

                teamName: 'teamName',

                volunteerFirstName: 'volunteerFirstName',
                volunteerLastName: 'volunteerLastName',
            });

            sponsors.map((sponsor, i) => {
                sponsor.pledges.map((pledge, j) => {
                    data.push({
                        firstName: sponsor.firstName,
                        lastName: sponsor.lastName,
                        email: sponsor.email,

                        hourly: pledge.support.hourly,
                        total: pledge.support.total,
                        date: pledge.support.date,

                        slug: pledge.sponsored.slug,

                        teamName: pledge.sponsored.name ? pledge.sponsored.name : null,

                        volunteerFirstName: pledge.sponsored.firstName ? pledge.sponsored.firstName : null,
                        volunteerLastName: pledge.sponsored.lastName ? pledge.sponsored.lastName : null,
                    });
                });
            });

            return data;
        })
        .then((data) => {
            return Csv.generate(data);
        })
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
    }
}

module.exports = csvController;
