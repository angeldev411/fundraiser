/* Import "logic" dependencies first */
import React, { Component } from 'react';

/* Then React components */
import Page from '../../../components/Page';
import AdminLayout from '../../../components/AdminLayout';
import AdminContentHeader from '../../../components/AdminContentHeader';
import AdminInviteTeamMembersForm from '../../../components/AdminInviteTeamMembersForm';

// TODO dynamic data
import * as data from '../../../common/test-data';

export default class AdminTeams extends Component {
    componentWillMount() {
        document.title = 'Teams | Raiserve';
    }

    render() {
        const pageNav = [
            {
                type: 'button',
                title: 'Invite members',
                content:
                    <AdminInviteTeamMembersForm
                        title={"Invite New Team Members"}
                        project={data.project}
                        team={data.team}
                    />,
            },
        ];


        return (
            <Page>
                <AdminLayout pageNav={pageNav}>
                    <AdminContentHeader
                        title={'My Team Dashboard'}
                        description={'Keep an eye on everyone on your team and watch their individual progress grow.'}
                    />
                </AdminLayout>
            </Page>
        );
    }
}
