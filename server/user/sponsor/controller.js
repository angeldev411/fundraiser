'use strict';
import Sponsor from './model';
import UserController from '../controller';

class sponsorController {
    static index(projectSlug = null, teamslug = null) {
        // return Volunteer.getVolunteers(projectSlug, teamslug)
        // .then((volunteers) => {
        //     return Promise.resolve(UserController.safeArray(volunteers));
        // })
        // .catch((err) => {
        //     console.log(err);
        // });
    }
}

module.exports = sponsorController;
