'use strict';
import User from '../model';
import { SUPER_ADMIN } from '../roles';

export default class SuperAdmin {
    constructor(data) {
        return new User(data, SUPER_ADMIN)
        .then((superAdmin) => {
            return superAdmin;
        });
    }
}
