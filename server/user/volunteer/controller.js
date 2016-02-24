'use strict';
import Volunteer from './model';
import messages from '../../messages';

class volunteerController {
    static index() {
        return Volunteer.getVolunteers()
        .then((volunteers) => {
            return Promise.resolve(volunteers);
        });
    }
}

module.exports = volunteerController;
