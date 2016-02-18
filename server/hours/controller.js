'use strict';

const Hours = require('./model.js');
const UUID = require('uuid');

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
                console.log('Catch result', result);
                reject(result);
            });
        });
    }
}

module.exports = hoursController;
