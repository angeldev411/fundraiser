/* Import "logic" dependencies first */
import React, { Component } from 'react';

/* Then React components */
import AuthenticatedView from '../AuthenticatedView';
import AdminLayout from '../../../components/AdminLayout';
import AdminVolunteersTable from '../../../components/AdminVolunteersTable';
import AdminContentHeader from '../../../components/AdminContentHeader';

// TODO dynamic data
import * as data from '../../../common/test-data';

export default class AdminVolunteers extends Component {
    componentWillMount() {
        document.title = 'Volunteers | Raiserve';
    }

    render() {
        let header = null;

        if (data.user.role === 'project-leader') {
            header = `${data.project.name} Volunteers`;
        } else {
            header = `Volunteers`;
        }

        return (
            <AuthenticatedView accessLevel={'PROJECT_LEADER'}>
                <AdminLayout>
                    <AdminContentHeader title={header}
                        description={'Keep an eye on everyone on your team and watch their individual progress grow.'}
                    />
                    <AdminVolunteersTable volunteers={data.volunteers}
                        actionable={false}
                    />
                </AdminLayout>
            </AuthenticatedView>
        );
    }
}
