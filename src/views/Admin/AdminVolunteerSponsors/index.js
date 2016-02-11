/* Import "logic" dependencies first */
import React, { Component } from 'react';

/* Then React components */
import Page from '../../../components/Page';
import Button from '../../../components/Button';
import CircleStat from '../../../components/CircleStat';
import AdminLayout from '../../../components/AdminLayout';
import AdminContentHeader from '../../../components/AdminContentHeader';
import AdminInviteTeamMembersForm from '../../../components/AdminInviteTeamMembersForm';
import AdminShareEfforts from '../../../components/AdminShareEfforts';
import AdminSponsorsTable from '../../../components/AdminSponsorsTable';
import * as Urls from '../../../urls.js';
// TODO dynamic data
import * as data from '../../../common/test-data';

export default class AdminVolunteerSponsors extends Component {
    componentWillMount() {
        document.title = 'My Sponsors | Raiserve';
    }

    render() {
        const pageNav = [
            {
                type: 'link',
                title: 'Record my hours',
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
                title: 'My Public Page',
                href: `${Urls.getVolunteerProfileUrl(data.project.slug, data.team.slug, data.volunteer.slug)}`,
            },
            {
                type: 'link',
                title: 'My Profile',
                href: `${Urls.ADMIN_VOLUNTEER_PROFILE_URL}`,
            },
        ];


        return (
            <Page>
                <AdminLayout pageNav={pageNav}>
                    <AdminContentHeader
                        title={'My sponsors'}
                        description={'Don’t forget to share your good fortune and give thanks on social media.'}
                    />
                    <div className={'table-limit-height'}>
                        <AdminSponsorsTable
                            sponsors={data.sponsors}
                            volunteer
                        />
                    </div>
                    <div className={"col-xs-12"}>
                        <section className={"sponsors-stats col-xs-12 col-sm-10"}>
                            <CircleStat
                                data={
                                    {
                                        current: data.team.volunteers.length,
                                        title: 'Volunteered hours',
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
                            <AdminShareEfforts/>
                        </section>
                    </div>
                </AdminLayout>
            </Page>
        );
    }
}
