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
}

module.exports = sponsorController;
