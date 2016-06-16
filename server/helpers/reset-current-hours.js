'use strict';
import Volunteer from '../user/volunteer/model';

console.log('Resetting hours');
Promise.resolve()
.then(Volunteer.resetCurrentHours)
.then((returned) => {
    process.exit();
})
.catch((err) => {
    console.error(err);
});
