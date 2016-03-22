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
            return Promise.reject(err);
        });
    }

    static indexTopVolunteers(projectSlug = null, teamslug = null) {
        return Volunteer.getTopVolunteers(projectSlug, teamslug)
        .then((volunteers) => {
            return Promise.resolve(UserController.safeArray(volunteers));
        })
        .catch((err) => {
            return Promise.reject(err);
        });
    }

    static update(currentUser, userData) {
        return Volunteer.updateVolunteer(currentUser, userData);
    }
}

module.exports = volunteerController;
