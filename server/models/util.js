/* @flow */

import schema from 'validate';
import s3 from 's3';
import AWS from 'aws-sdk';
import crypto from 'crypto';
import sha256 from 'js-sha256';

AWS.config.loadFromPath('./s3_config.json');

class util {

    static cacheResponse(obj) {
        const shasum = crypto.createHash('sha1');

        shasum.update(JSON.stringify(obj));
        key = shasum.digest('hex');

        // lookup cached item

        // return it if not expired
    }


    // we have some methods that return a standard structure
    // could also include custom error codes
    static rsSuccess(obj, friendlyMessage = null) {
        return {
            status: 'rssuccess',
            friendlyMessage: friendlyMessage,
            payload: obj,
        };
    }

    static rsFailure(obj, friendlyMessage = null) {
        if (typeof (obj) !== 'object') {
            obj = [obj];
        }

        return {
            status: 'rsfailure',
            friendlyMessage: friendlyMessage,
            payload: obj,
        };
    }

    static hashPassword(password: string) : string {
        return password;
    }

    static parseJSON(str:string) {
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

    /*
    Access Key ID:
    AKIAJWMS4PAKZZ2LTEOA
    Secret Access Key:
    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
    */
    static uploadToS3(
        filedata: string,
        bucket: string,
        key: string,
        fileParams: {contentType: string},
        cb: func
    ) {
        // AWS.config.logger = process.stdout;

        const s3Bucket = new AWS.S3({ params: { Bucket: bucket } });
        const buf = new Buffer(filedata.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        const data = {
            Key: key,
            Body: buf,
            ContentEncoding: 'base64',
            ContentType: fileParams.contentType,
        };

        s3Bucket.putObject(data, (err, resp) => {
            if (err) {
                console.log(err);
                console.log('Error uploading to s3:  ', resp);
                cb(err, resp);
            } else {
                cb(err, resp);
            }
        });
    }

    static detectContentType(url: string) {
        try {
            return url.split(';')[0].split(':')[1];
        } catch (e) {
            return 'binary/octet-stream';
        }
    }


    static uploadRsImage(obj) {
        // console.log("uploadRsImage: " + obj.image_data);
        console.log("GOT UUID " + obj.uuid);

        return new Promise((resolve, reject) => {
            const contentType = util.detectContentType(obj.image_data);
            const contentTypeExtension = {
                'image/jpeg': 'jpg',
                'image/png': 'png',
                'image/gif': 'gif',
                'application/binary': 'bin'
            }[contentType];

            try {
                const sha = sha256(obj.image_data);

                obj.key = `${obj.key_prefix}${obj.uuid}/${sha}.${contentTypeExtension}`;

                console.log('uploading with key ' + obj.key);

                util.uploadToS3(
                    obj.image_data,
                    'raiserve',
                    obj.key,
                    { contentType: contentType },
                    (err, data) => {
                        if (err) {
                            reject(`error uploading image data ${err}`);
                        } else {
                            delete(obj.image_data);
                            console.log("upload resolving with " + JSON.stringify(obj));
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




module.exports = util;
