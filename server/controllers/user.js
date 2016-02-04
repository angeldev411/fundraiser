const User = require('../models/user');

function checkCredentials(creds) {
    // TODO: swap password with hashed password
    return User.findByEmail()
    .then((result) => {
        if (result.length > 0) {
            return Promise.resolve(result[0].uuid);
        } else {
            return Promise.reject('invalid username or password');
        }
    });
}

// Corporate?
function createProject(obj) {
    return Project.validate(obj)
    .then(Project.validateUniqueName)
    .then(Project.uploadSplashImage)
    .then(Corporate.insertProjectIntoDb);
}
