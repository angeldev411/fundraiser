import donation from '../models/donation.js';

console.log(JSON.stringify(donation));

let o = {
    name: "matt",
    email: "mmmurf3@gmail.com",
    team_slug: "stj",
    recipient_uuid: null,
    amount: 5.0,
    max: 55.0
};

let result = donation.validate(o)
    .then(donation.validateUniqueEmail)
    .then(donation.createStripeProfile)
    .then(donation.insertIntoDb)
    .catch((err) => {
        console.log("problem " + JSON.stringify(err));
    })
    .then((obj)=> {
        console.log(JSON.stringify(obj));
        console.log("over");
    });
