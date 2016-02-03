import schema from 'validate';
import UUID from 'uuid';
import neo4jDB from 'neo4j-simple';
import config from '../config';

const db = neo4jDB(config.DB_URL);

const hoursSchema = schema({
    hours: {
        type: 'number',
        required: true,
        message: 'The number of hours volunteered is required',
    },
    signatureData: {
        type: 'string',
        required: true,
    },
    userUUID: {
        type: 'string',
        required: true,
    },
    place: {
        type: 'string',
        required: true,
        message: 'a place is required',
    },
    date: {
        type: 'date',
        required: true,
        message: 'the date is required',
    },
    supervisorName: {
        type: 'string',
        required: true,
        message: "your supervisor's name is required",
    },
}, {
    strip: false,
    typecast: true,
});

class hours {
    /* the volunteer logs the service */
    /* fails if the user isn't a volunteer for the team */
    static insertIntoDb(obj) {
        if (!obj.uuid) {
            obj.uuid = UUID.v4();
        }

        console.log('hours log entry');
        console.log(obj);

        return db.query(`
            MATCH (volunteer:User {uuid: {userUUID} })-[:VOLUNTEER]->(team:Team)-[:FUNDRAISING_FOR]->(project:Project)
            WHERE team.short_name = {team_short_name}

            CREATE (service:ServiceLogEntry {hours: {hours}, uuid: {uuid}, place: {place}, date: {date}, supervisorName: {supervisorName}, signature_url: {signature_url} })
            CREATE (volunteer)-[:LOGGED]->(service)
            CREATE (service)-[:LOGGED_FOR_TEAM]->(team)
            CREATE (service)-[:LOGGED_FOR_PROJECT]->(project)

            RETURN service`
            , {}, obj
        )
        .getResults('service')
        .then((results) => {
            if (results.length > 0) {
                const hoursSaved = results[0];

                hoursSaved.signatureData = obj.signatureData;
                return Promise.resolve(hoursSaved);
            } else {
                return Promise.reject("No access: Either user is not volunteer or team short name doesn't exist");
            }
        });
    }

    static uploadSignature(obj) {
        const key = `signatures/${obj.uuid}.png`;

        const contentType = util.detectContentType(obj.signatureData);

        return new Promise((resolve, reject) => {
            util.uploadToS3(
                obj.signatureData,
                'raiserve',
                key,
                { contentType },
                (err, res) => {
                    if (err) {
                        reject(`Unable to upload signature: ${err}`);
                    } else {
                        delete obj.signatureData;
                        obj.signature_url = key;
                        resolve(obj);
                    }
                }
            );
        });
    }

    static validateHours(obj) {
        const errs = hoursSchema.validate(obj);

        if (errs.length === 0) {
            return Promise.resolve(obj);
        } else {
            return Promise.reject(`Validation error: ${errs}`);
        }
    }
}

export default hours;
