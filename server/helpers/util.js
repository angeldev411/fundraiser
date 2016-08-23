'use strict';
// import s3 from 's3';
import AWS from 'aws-sdk';
import crypto from 'crypto';
import sha256 from 'js-sha256';
import config from '../config';

AWS.config.update(config.S3_ACCESS);

class util {
    static isFirstNameValid(firstName) {
        const firstNameRegexp = /^.+$/g;

        return firstNameRegexp.test(firstName);
    }

    static isLastNameValid(lastName) {
        const lastNameRegexp = /^.+$/g;

        return lastNameRegexp.test(lastName);
    }

    static isEmailValid(email) {
        const emailRegexp = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*(\+[a-z0-9-]+)?@[a-z0-9-]+(\.[a-z0-9-]+)*$/i;

        return emailRegexp.test(email);
    }

    static isGoalValid(goal) {
        if (goal >= 0 && goal < 1000) {
            return true;
        }
        return false;
    }

    static isPasswordValid(password) {
        const passwordRegexp = /^.+$/g;

        return passwordRegexp.test(password);
    }

    static cacheResponse(obj) {
        const shasum = crypto.createHash('sha1');

        shasum.update(JSON.stringify(obj));
        key = shasum.digest('hex');

        // lookup cached item

        // return it if not expired
    }

    static hash(password) {
        try {
            return sha256(password);
        } catch (e) {
            throw new Error(`Password is not a string! (${password})`);
        }
    }

    static parseJSON(str) {
        return new Promise((resolve, reject) => {
            if (str === null) {
                reject('Expects a JSON string, got null');
            } else {
                try {
                    resolve(str);
                } catch (e) {
                    reject(`invalid JSON data: ${e}`);
                }
            }
        });
    }

    static uploadToS3(
        filedata,
        key,
        fileParams,
        cb
    ) {
        // AWS.config.logger = process.stdout;
        const s3Bucket = new AWS.S3({ params: { Bucket: config.S3.BUCKET } });
        const buf = new Buffer(filedata.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        const data = {
            Key: key,
            Body: buf,
            ContentEncoding: 'base64',
            ContentType: fileParams.contentType,
        };

        s3Bucket.putObject(data, (err, resp) => {
            if (err) {
                console.log('Error uploading to s3:  ', resp);
                cb(err, resp);
            } else {
                cb(err, resp);
            }
        });
    }

    static detectContentType(url) {
        try {
            return url.split(';')[0].split(':')[1];
        } catch (e) {
            return 'binary/octet-stream';
        }
    }

    static uploadRsImage(obj, imageUsage) {

        return new Promise((resolve, reject) => {
            const contentType = util.detectContentType(obj.image_data);
            const contentTypeExtension = {
                'image/jpeg': 'jpg',
                'image/png': 'png',
                'image/gif': 'gif',
                'application/binary': 'bin',
            }[contentType];

            try {
                const sha = sha256(obj.image_data);
                let imageNamePrefix = '';

                if (imageUsage) {
                    imageNamePrefix = `${imageUsage}_`;
                }


                obj.key = `${obj.key_prefix}${obj.uuid}/${imageNamePrefix}${sha}.${contentTypeExtension}`;

                util.uploadToS3(
                    obj.image_data,
                    obj.key,
                    { contentType },
                    (err, data) => {
                        if (err) {
                            reject(`error uploading image data ${err}`);
                        } else {
                            delete obj.image_data;
                            resolve(obj);
                        }
                    }
                );
            } catch (e) {
                reject(`util.uploadRsImage: upload error: ${e} ${e.stack}`);
            }
        });
    }
}

export default util;
