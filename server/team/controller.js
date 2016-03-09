'use strict';
import Team from './model';
import messages from '../messages';

class teamController {
    static store(data, projectSlug) {
        let teamObject = null;

        return Team.insert(data.team)
            .then((team) => {
                teamObject = team;
                return Team.linkTeamCreatorAndProject(team.id, data.currentUser.id, projectSlug);
            })
            .then(() => {
                return Team.inviteTeamLeader(teamObject);
            })
            .then((result) => {
                return Promise.resolve(result);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }

    static update(data) {
        //
    }
}

module.exports = teamController;
