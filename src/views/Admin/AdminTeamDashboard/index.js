/* Import "logic" dependencies first */
import React, { Component } from 'react';

/* Then React components */
import Page from '../../../components/Page';
import CircleStat from '../../../components/CircleStat';
import AdminLayout from '../../../components/AdminLayout';
import AdminContentHeader from '../../../components/AdminContentHeader';
import AdminInviteTeamMembersForm from '../../../components/AdminInviteTeamMembersForm';

// TODO dynamic data
import * as data from '../../../common/test-data';

export default class AdminTeamDashboard extends Component {
    componentWillMount() {
        document.title = 'Dashboard | Raiserve';
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
                    <CircleStat
                        data={
                            {
                                goal: 10,
                                current: 5,
                                title: 'Volunteers'
                            }
                        }
                    />
                    <CircleStat
                        data={
                            {
                                current: 210,
                                title: 'Sponsors'
                            }
                        }
                    />
                    <CircleStat
                        data={
                            {
                                current: '7.110',
                                title: '$ Raised'
                            }
                        }
                    />
                </AdminLayout>
            </Page>
        );
    }
}
