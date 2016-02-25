'use strict';
import Volunteer from './model';
import UserController from '../controller';
import messages from '../../messages';

class volunteerController {
    static index() {
        return Volunteer.getVolunteers()
        .then((volunteers) => {
            return Promise.resolve(UserController.safeArray(volunteers));
        });
    }
}

module.exports = volunteerController;
