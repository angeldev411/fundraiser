import fixtures from '../tests_helpers/fixtures';
import hoursController from './controller.js';

const expect = require('chai').expect;

describe('Hours', () => {
    describe('Log', () => {
        it('stores a hours object in the database', (done) => {
            const hour = fixtures.hours[0];

            hour.signatureData = hour.signatureData.base64;
            hoursController.log(fixtures.volunteers[0].id, hour).then((result) => {
                expect(result.id).not.to.be.undefined;
                done();
            }).catch((result) => {
                expect(result.id).not.to.be.undefined;
                done();
            });
        });
    });
});
