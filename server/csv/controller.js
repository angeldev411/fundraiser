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

            for (let i = 0; i < volunteers.length; i++) {
                data.push({
                    firstName: volunteers[i].firstName,
                    lastName: volunteers[i].lastName,
                    email: volunteers[i].email,
                    currentHours: volunteers[i].currentHours,
                    goal: volunteers[i].goal,
                    totalHours: volunteers[i].totalHours,
                    totalSponsors: volunteers[i].totalSponsors,
                    raised: volunteers[i].raised,
                    signupDate: new Date(volunteers[i].created).toDateString(),
                });
            }
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
            // process sponsors
            return sponsors;
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
