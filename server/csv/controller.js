'use strict';
import Volunteer from '../user/volunteer/model';
import Sponsor from '../user/sponsor/model';
import Csv from './model';

class csvController {
    static getTeamVolunteers(user) {
        return Volunteer.getVolunteers(user.project.slug, user.team.slug)
        .then((volunteers) => {
            // process volunteers
            return volunteers;
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
