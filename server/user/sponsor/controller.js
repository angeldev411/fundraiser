'use strict';
import Sponsor from './model';

class sponsorController {
    static index(projectSlug = null, teamslug = null, volunteerSlug = null) {
        return Sponsor.getSponsors(projectSlug, teamslug, volunteerSlug)
        .then((sponsors) => {
            return Promise.resolve(sponsors);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
    }

    static sponsorVolunteer(data, volunteerSlug) {
        return new Promise((resolve, reject) => {
            const sponsor = {
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                ...(data.stripeToken ? { stripeToken: data.stripeToken } : {}),
            };

            const pledge = {
                ...(data.hourly ? { hourly: data.hourly } : {}),
                ...(data.amount ? { amount: data.amount } : {}),
            };

            new Sponsor(sponsor, pledge, null, volunteerSlug)
            .then((sponsorCreated) => {
                resolve(sponsorCreated);
            })
            .catch((err) => {
                console.log('sponsor err', err);
                reject(err);
            });
        });
    }
}

module.exports = sponsorController;
