'use strict';

import Promise from 'bluebird';
import Hours from './model.js';
import UUID from 'uuid';

class hoursController {
    static log(userId, newHours) {
        if (!newHours.id) {
            newHours.id = UUID.v4();
        }
        return new Promise((resolve, reject) => {
            Hours.uploadSignature(newHours).then((obj) => {
                Hours.insert(userId, obj).then((result) => {
                    resolve(result);
                }).catch((result) => {
                    reject(result);
                });
            }).catch((result) => {
                console.log('[HOUR CONTROLLER] Error', result);
                reject(result);
            });
        });
    }
}

module.exports = hoursController;
