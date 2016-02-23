/* Import "logic" dependencies first */
import React, { Component } from 'react';

/* Then React components */
import AuthenticatedView from '../AuthenticatedView';
import AdminLayout from '../../../components/AdminLayout';
import AdminTeamsTable from '../../../components/AdminTeamsTable';
import AdminContentHeader from '../../../components/AdminContentHeader';
import AdminTeamForm from '../../../components/AdminTeamForm';

// TODO dynamic data
import * as data from '../../../common/test-data';
const project = data.project;

export default class AdminTeams extends Component {
    componentWillMount() {
        document.title = 'Teams | Raiserve';
    }

    render() {
        const pageNav = [
            {
                type: 'button',
                title: 'Add New Team',
                content:
                    <AdminTeamForm
                        title={"Add New Team"}
                        project={project}
                    />,
            },
        ];


        return (
            <AuthenticatedView accessLevel={'PROJECT_LEADER'}>
                <AdminLayout pageNav={pageNav}>
                    <AdminContentHeader
                        title={`${project.name} Teams`}
                        description={'Keep an eye on everyone on your team and watch their individual progress grow.'}
                    />
                    <AdminTeamsTable
                        teams={project.teams}
                        project={project}
                        actionable={true}
                    />
                </AdminLayout>
            </AuthenticatedView>
        );
    }
}
