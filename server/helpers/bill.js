'use strict';
import Sponsor from '../user/sponsor/model';
import Volunteer from '../user/volunteer/model';

export function monthlyPayments() {
    console.log(String.fromCharCode(0xD83D,0xDCB0), String.fromCharCode(0xD83D,0xDCB0), String.fromCharCode(0xD83D,0xDCB0));

    Promise.resolve()
    .then(Sponsor.billSponsors)
    // .then(() => {
    //     console.log('Reset current hours');
    //     Volunteer.resetCurrentHours();
    // })
    .catch((err) => {
        console.error(err);
    });
}
