'use strict';
import Volunteer from '../user/volunteer/model';

Promise.resolve()
.then(Volunteer.resetCurrentHours)
.then((returned) => {
    process.exit();
})
.catch((err) => {
    console.error(err);
});
