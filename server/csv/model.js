'use strict';
import csv from'csv';

class Csv {
    static generate(data) {
        return new Promise((resolve, reject) => {
            csv.stringify(data, (err, data) => {
                if (err) {
                    return reject(err);
                }
                return resolve(data);
            });
        });
    }
}

export default Csv;
