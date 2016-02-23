'use strict';
import Team from './model';
import messages from '../messages';

class teamController {
    static store(data, projectSlug) {
        return new Team(data, projectSlug)
        .then((team) => {
            return Promise.resolve(team);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
    }
}

module.exports = teamController;
