/* Import "logic" dependencies first */
import React, { Component } from 'react';

/* Then React components */
import Page from '../../../components/Page';
import AdminStatsBlock from '../../../components/AdminStatsBlock';
import AdminLayout from '../../../components/AdminLayout';
import AdminContentHeader from '../../../components/AdminContentHeader';
import AdminInviteTeamMembersForm from '../../../components/AdminInviteTeamMembersForm';
import AdminDownloadCsv from '../../../components/AdminDownloadCsv';
import AdminSponsorsTable from '../../../components/AdminSponsorsTable';
import * as Urls from '../../../urls.js';
// TODO dynamic data
import * as data from '../../../common/test-data';

export default class AdminTeamSponsors extends Component {
    componentWillMount() {
        document.title = 'Team Sponsors | Raiserve';
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
                title: 'Edit Team Profile',
                href: `${Urls.ADMIN_TEAM_PROFILE_URL}`,
            },
        ];


        return (
            <Page>
                <AdminLayout pageNav={pageNav}>
                    <AdminContentHeader
                        title={'Team sponsors'}
                        description={'Keep an eye on everyone on your team and watch their individual progress grow.'}
                    />
                    <div className={'table-limit-height'}>
                        <AdminSponsorsTable sponsors={data.sponsors} />
                    </div>
                    <AdminStatsBlock
                        stats={
                            [
                                {
                                    current: data.team.volunteers.length,
                                    title: 'Volunteers',
                                },
                                {
                                    current: data.team.sponsors.length,
                                    title: 'Sponsors',
                                },
                                {
                                    current: data.team.raised,
                                    title: '$ Raised',
                                },
                            ]
                        }
                    >
                        <AdminDownloadCsv/>
                    </AdminStatsBlock>
                </AdminLayout>
            </Page>
        );
    }
}
