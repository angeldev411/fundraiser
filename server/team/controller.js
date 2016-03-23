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
        let team;

        return Team.update(data.team)
        .then((result) => {
            team = result;
            return Team.inviteTeamLeader(data.team);
        })
        .then((result) => {
            return Promise.resolve(team);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
    }
}

module.exports = teamController;
