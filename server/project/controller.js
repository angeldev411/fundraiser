'use strict';
import Project from './model';
import messages from '../messages';

class projectController {
    static store(data) {
        return new Project(data)
        .then((p) => {
            return Promise.resolve(p);
        });
    }
}

module.exports = projectController;
