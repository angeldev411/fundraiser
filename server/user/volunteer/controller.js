'use strict';
import Volunteer from './model';
import UserController from '../controller';
import messages from '../../messages';

class volunteerController {
    static index(projectSlug = null, teamslug = null) {
        return Volunteer.getVolunteers(projectSlug, teamslug)
        .then((volunteers) => {
            return Promise.resolve(UserController.safeArray(volunteers));
        })
        .catch((err) => {
            // console.log(err);
        });
    }
}

module.exports = volunteerController;
