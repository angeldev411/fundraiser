/* Import "logic" dependencies first */
import React, { Component } from 'react';

/* Then React components */
import Page from '../../../components/Page';
import Button from '../../../components/Button';
import CircleStat from '../../../components/CircleStat';
import ModalButton from '../../../components/ModalButton';
import AdminLayout from '../../../components/AdminLayout';
import AdminContentHeader from '../../../components/AdminContentHeader';
import AdminInviteTeamMembersForm from '../../../components/AdminInviteTeamMembersForm';
import AdminDownloadCsv from '../../../components/AdminDownloadCsv';
import AdminVolunteersTable from '../../../components/AdminVolunteersTable';
import * as Urls from '../../../urls.js';
// TODO dynamic data
import * as data from '../../../common/test-data';

export default class AdminTeamVolunteers extends Component {
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
                title: 'My Team Profile',
                href: `${Urls.ADMIN_TEAM_PROFILE_URL}`,
            },
        ];


        return (
            <Page>
                <AdminLayout pageNav={pageNav}>
                    <AdminContentHeader
                        title={'My Team'}
                        description={'Keep an eye on everyone on your team and watch their individual progress grow.'}
                        buttons={
                            <ModalButton type="btn-link pull-right uppercase"
                                content={<AdminInviteTeamMembersForm title={"Invite New Members"}/>}
                            >
                                {'Invite members'}
                            </ModalButton>
                        }
                    />
                    <div className={'table-limit-height'}>
                        <AdminVolunteersTable volunteers={data.team.volunteers}
                            editable={true}
                        />
                    </div>
                    <div className={"col-xs-12"}>
                        <section className={"sponsors-stats col-xs-12 col-sm-10"}>
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
                        <section className={"col-xs-12 col-sm-2"}>
                            <AdminDownloadCsv/>
                        </section>
                    </div>
                </AdminLayout>
            </Page>
        );
    }
}
