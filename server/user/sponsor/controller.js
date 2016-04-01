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

    static sponsorTeam(data, teamSlug) {
        return new Promise((resolve, reject) => {
            const date = new Date();

            const sponsor = {
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                volunteerLastBilling: new Date().getTime(),
                teamLastBilling: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime(), // Get first day of month timestamp
            };

            const pledge = {
                ...(data.hourly ? { hourly: data.hourly } : {}),
                ...(data.amount ? { amount: data.amount } : {}),
            };

            return new Sponsor(sponsor, pledge, teamSlug, data.stripeToken)
            .then((sponsorCreated) => {
                resolve(sponsorCreated);
            })
            .catch((err) => {
                reject(err);
            });
        });
    }

    static sponsorVolunteer(data, volunteerSlug) {
        return new Promise((resolve, reject) => {
            const date = new Date();

            const sponsor = {
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                volunteerLastBilling: new Date().getTime(),
                teamLastBilling: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime(), // Get first day of month timestamp
            };

            const pledge = {
                ...(data.hourly ? { hourly: data.hourly } : {}),
                ...(data.amount ? { amount: data.amount } : {}),
            };

            new Sponsor(sponsor, pledge, null, volunteerSlug, data.stripeToken)
            .then((sponsorCreated) => {
                resolve(sponsorCreated);
            })
            .catch((err) => {
                reject(err);
            });
        });
    }
}

module.exports = sponsorController;
