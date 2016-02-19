'use strict';
const Team = require('./model');
const messages = require('../messages');

class teamController {
    static store(data) {
        return new Team(data)
        .then((team) => {
            return Promise.resolve(team);
        });
    }
}

module.exports = teamController;
