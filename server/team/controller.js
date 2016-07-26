'use strict';
import Team from './model';
import uuid from 'uuid';

class teamController {
    static store(data, projectSlug) {
        let teamObject = null;
        const fakeLeaderId = uuid.v4();

        data.team.fakeLeaderId = fakeLeaderId;

        return Team.insert(data.team)
        .then((team) => {
            teamObject = team;
            return Team.linkTeamCreatorAndProject(team.id, data.currentUser.id, projectSlug);
        })
        // XXX: Can this be deleted now?
        .then(() => {
            return Team.createFakeLeader(teamObject.id, fakeLeaderId);
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
            return Promise.resolve(team);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
    }

    static removeTeam(teamId, userId) {
        return Team.removeTeam(teamId, userId)
        .then((result) => {
            return Promise.resolve(result);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
    }
}

module.exports = teamController;
