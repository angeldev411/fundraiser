/* Import "logic" dependencies first */
import React, { Component } from 'react';

/* Then React components */
import Page from '../../../components/Page';
import AdminLayout from '../../../components/AdminLayout';
import AdminTeamsTable from '../../../components/AdminTeamsTable';
import AdminContentHeader from '../../../components/AdminContentHeader';

// TODO dynamic data
import * as data from '../../../common/test-data';
const project = data.project;

export default class ProjectLeaderTeams extends Component {
    componentWillMount() {
        document.title = 'Teams | Raiserve';
    }

    render() {
        return (
            <Page>
                <AdminLayout>
                    <AdminContentHeader title={`${project.name} Teams`}
                        description={'Keep an eye on everyone on your team and watch their individual progress grow.'}
                    />
                    <AdminTeamsTable teams={project.teams}
                        project={project}
                        editable={true}
                    />
                </AdminLayout>
            </Page>
        );
    }
}
