/* Import "logic" dependencies first */
import React, { Component } from 'react';

/* Then React components */
import Page from '../../../components/Page';
import AdminLayout from '../../../components/AdminLayout';
import AdminProjectForm from '../../../components/AdminProjectForm';
import AdminVolunteersTable from '../../../components/AdminVolunteersTable';
import AdminContentHeader from '../../../components/AdminContentHeader';

// TODO dynamic data
import * as data from '../../../common/test-data';
const volunteers = [];

// Create array of volunteers
for (let i = 0; i < 20; i++) {
    volunteers.push(data.volunteer);
}

export default class SuperAdminVolunteers extends Component {
    componentWillMount() {
        document.title = 'Volunteers | Raiserve';
    }

    render() {
        return (
            <Page>
                <AdminLayout>
                    <AdminContentHeader title={'Volunteers'}
                        description={'Keep an eye on everyone on your team and watch their individual progress grow.'}
                    />
                    <AdminVolunteersTable volunteers={volunteers}
                        editable={false}
                    />
                </AdminLayout>
            </Page>
        );
    }
}
