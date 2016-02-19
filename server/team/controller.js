'use strict';
import Team from './model';
import messages from '../messages';

class teamController {
    static store(data) {
        return new Team(data)
        .then((team) => {
            return Promise.resolve(team);
        });
    }
}

module.exports = teamController;
