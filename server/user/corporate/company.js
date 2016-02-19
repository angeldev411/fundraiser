'use strict';
import schema from 'validate';
import UUID from 'uuid';
import neo4jDB from 'neo4j-simple';
import config from '../../config';

const db = neo4jDB(config.DB_URL);

const companySchema = schema({
    name: {},
    shortName: {},
    uuid: {},
});

class Company {
    static create(obj) {
        return Company.validate(obj)
        .then(Company.insertIntoDb);
    }

    static validate(obj) {
        const errs = companySchema.validate(obj);

        return new Promise((resolve, reject) => {
            if (errs.length === 0) {
                resolve(obj);
            } else {
                reject(errs);
            }
        });
    }

    static insertIntoDb(obj) {
        if (!obj.uuid) {
            obj.uuid = UUID.v4();
        }

        return db.query(
            `
            MERGE (company:Company {shortName: {shortName}})
            ON CREATE SET company.uuid = {uuid}

            RETURN company
            `,
            {},
            obj
        )
        .getResult('company');
    }

    static assignCorporate(obj) {
        console.log('assigning super admin from');
        console.log(obj);

        return db.query(
            `
            MATCH (company:Company {uuid: {companyUUID}})
            MATCH (user:User) WHERE user.uuid = {userUUID}

            CREATE (user)-[:SUPER_ADMIN]->(company)

            RETURN company
            `,
            {},
            obj
        )
        .getResult('company');
    }
}

export default Company;
