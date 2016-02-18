'use strict';

import User from '../model';

export default class SuperAdmin {
    constructor(data) {
        return new User(data, 'SUPER_ADMIN')
        .then((superAdmin) => {
            console.log(superAdmin);
            // create relationShip with company
            return superAdmin;
        });
    }
}
