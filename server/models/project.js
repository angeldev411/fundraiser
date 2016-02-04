import schema from 'validate';
import UUID from 'uuid';
import neo4jDB from 'neo4j-simple';
import config from '../config';

const db = neo4jDB(config.DB_URL);

const projectSchema = schema({
    name: {
        type: 'string',
        message: 'A name is required',
    },
    creator_uuid: {
        type: 'string',
        message: 'UUID of the creating user is required',
    },
    shortName: {
        type: 'string',
    },
    short_description: {},
    long_description: {},
    uuid: {
        type: 'string',
    },
    splash_image_data: {
        required: true,
    },
});

class Project {
    static validate(obj) {
        const errs = projectSchema.validate(obj);

        return new Promise((resolve, reject) => {
            if (errs.length === 0) {
                resolve(obj);
            } else {
                reject(errs);
            }
        });
    }

    static validateUniqueName(obj) {
        return db.query(
            `
            MATCH (project:Project {name: {name} }) RETURN project
            `,
            {},
            obj
        )
        .getResults('project')
        .then((result) => {
            if (result.length === 0) {
                return obj;
            } else {
                return Promise.reject('duplicate project name :)');
            }
        });
    }

    /* deprecated */
    static insertIntoDbdeprecated(obj) {
        obj.uuid = UUID.v4();

        return db.query(
            `
            MATCH (creator:User {uuid: {creator_uuid}})

            CREATE (project:Project
                {name: {name},
                shortName: {shortName},
                short_description: {short_description},
                long_description: {long_description},
                uuid: {uuid} }
            )

            CREATE (creator)-[:CREATOR]->(project)
            CREATE (creator)-[:OWNER]->(project)

            RETURN project

            `,
            {},
            obj
        )
        .getResults('project')
        .then((result) => {
            // we put the image url back in
            result[0].splash_image_data = obj.splash_image_data;
            return Promise.resolve(result[0]);
        });
    }

    static uploadSplashImage(obj: {splash_image_data: string}) {
        return util.uploadRsImage({
            key_prefix: 'images/splash/',
            uuid: obj.uuid,
            image_data: obj.splash_image_data,
        })
        .then((result) => {
            obj.splash_image_key = result.key;
            return Promise.resolve(obj);
        });
    }

    /* expects obj.uuid and obj.key */
    static insertSplashImageIntoDb(obj) {
        console.log('trying to insert splash image into db');
        console.log(obj.uuid);

        return db.query(
            `
            MATCH (project:Project {uuid: {uuid} })
            CREATE (img:Image {key: {key} })
            CREATE (project)-[:SPLASH_IMAGE]->(img)

            RETURN img
            `,
            {},
            obj
        )
        .getResults('img');
    }

    // SECURITY: explicitly define return attributes
    static findByShortName(shortName) {
        return db.query(
            `MATCH (project:Project {shortName: {shortName} }) RETURN project`,
            {},
            { shortName }
        )
        .getResults('project');
    }

    static fetchAdminStats(projectUUID) {
        return db.query(
            `MATCH (project:Project {uuid: {projectUUID} }) RETURN project`,
            {},
            { projectUUID }
        )
        .getResult('project');
    }

    // SECURITY: explicitly define return attributes
    static findAll() {
        return db.query(
            `MATCH (project:Project) RETURN project`,
            {},
            {}
        )
        .getResults('project');
    }

    // SECURITY: explicitly define return attributes
    static findAllTeams(projectUUID) {
        return db.query(
            `MATCH (project:Project {uuid: {projectUUID} })<-[:FUNDRAISING_FOR]-(team:Team) RETURN team`,
            {},
            { projectUUID }
        )
        .getResults('team');
    }
}


export default Project;