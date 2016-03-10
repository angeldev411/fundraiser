'use strict';
import Sponsor from '../user/sponsor/model';

console.log(String.fromCharCode(0xD83D,0xDCB0), String.fromCharCode(0xD83D,0xDCB0), String.fromCharCode(0xD83D,0xDCB0));

Promise.resolve()
.then(Sponsor.billSponsors());
