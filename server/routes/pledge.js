'use strict';
// Pledge
router.post('/api/v1/pledge', function(req, res){
    console.log("got pledge");
    console.log(req.body)

    pledge.create(req.body)
    .then(function(result){
        console.log(" post server plege OK");
        res.send(util.rsSuccess(result));
    })
    .catch(function(err){
        console.log("post server pledge err " + err);
        var payload = util.rsFailure({errors: err});
        console.log(payload);
        res.send(payload);
    })
})

// Donate, not used yet
router.post('/api/v1/donate/:team', function(req, res) {
    console.log('donate called');
    console.log(req.body);

    let result =
    donation.validate(req.body) // util.parseJSON(req.body)
    .then(donation.validateUniqueEmail)
    .then(donation.createStripeProfile)
    .then(donation.insertIntoDb)
    .catch((err) => {
        let result = JSON.stringify({errors: err});
        res.send(result);
    })
    .then((obj)=> {
        req.session.user_uuid = obj.new_uuid;
        res.send("success");
    });
});
