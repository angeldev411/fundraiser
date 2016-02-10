/* Import "logic" dependencies first */
import React, { Component } from 'react';

/* Then React components */
import Page from '../../../components/Page';
import CircleStat from '../../../components/CircleStat';
import UserList from '../../../components/UserList';
import AdminLayout from '../../../components/AdminLayout';
import AdminContentHeader from '../../../components/AdminContentHeader';
import AdminInviteTeamMembersForm from '../../../components/AdminInviteTeamMembersForm';
import AdminShareEfforts from '../../../components/AdminShareEfforts';

// TODO dynamic data
import * as data from '../../../common/test-data';

export default class AdminTeamDashboard extends Component {
    componentWillMount() {
        document.title = 'Dashboard | Raiserve';
    }

    render() {
        const pageNav = [
            {
                type: 'link',
                title: 'Email Your Team',
                href: '#',
            },
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
            {
                type: 'link',
                title: 'My Public Team Page',
                href: `${Urls.getTeamProfileUrl(data.project.slug, data.team.slug)}`,
            },
            {
                type: 'link',
                title: 'My Team Profile',
                href: `${Urls.ADMIN_TEAM_PROFILE_URL}`,
            },
        ];


        return (
            <Page>
                <AdminLayout pageNav={pageNav}>
                    <AdminContentHeader
                        title={'My Team Dashboard'}
                        description={'Keep an eye on everyone on your team and watch their individual progress grow.'}
                    />
                    <section className={"stats col-xs-12"}>
                        <CircleStat
                            data={
                                {
                                    current: data.team.volunteers.length,
                                    title: 'Volunteers',
                                }
                            }
                        />
                        <CircleStat
                            data={
                                {
                                    current: data.team.sponsors.length,
                                    title: 'Sponsors',
                                }
                            }
                        />
                        <CircleStat
                            data={
                                {
                                    current: data.team.raised,
                                    title: '$ Raised',
                                }
                            }
                        />
                    </section>
                    <section className={"col-xs-12"}>
                        <section className={"col-xs-12 col-sm-10"}>
                            <div className="content-header">
                                <h2 className="uppercase">{'Top earners'}</h2>
                                <hr/>
                            </div>
                            <UserList
                                team={data.team}
                                color="dark"
                                noSponsor
                            />
                        </section>
                        <section className={"col-xs-12 col-sm-2"}>
                            <AdminShareEfforts/>
                        </section>
                    </section>
                </AdminLayout>
            </Page>
        );
    }
}
