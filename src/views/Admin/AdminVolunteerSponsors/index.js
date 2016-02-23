/* Import "logic" dependencies first */
import React, { Component } from 'react';

/* Then React components */
import AuthenticatedView from '../AuthenticatedView';
import AdminLayout from '../../../components/AdminLayout';
import AdminContentHeader from '../../../components/AdminContentHeader';
import AdminStatsBlock from '../../../components/AdminStatsBlock';
import AdminSponsorsTable from '../../../components/AdminSponsorsTable';
import AdminShareEfforts from '../../../components/AdminShareEfforts';
import RecordHoursForm from '../../../components/RecordHoursForm';

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
                type: 'button',
                title: 'Record my hours',
                content: <RecordHoursForm/>,
            },
            {
                type: 'link',
                title: 'My Public Page',
                href: `${Urls.getVolunteerProfileUrl(data.project.slug, data.team.slug, data.volunteer.slug)}`,
            },
            {
                type: 'link',
                title: 'Edit Profile',
                href: `${Urls.ADMIN_VOLUNTEER_PROFILE_URL}`,
            },
        ];


        return (
            <AuthenticatedView accessLevel={'VOLUNTEER'}>
                <AdminLayout pageNav={pageNav}>
                    <AdminContentHeader
                        title={'My sponsors'}
                        description={'Don’t forget to share your good fortune and give thanks on social media.'}
                    />
                    <div className={'table-limit-height'}>
                        <AdminSponsorsTable
                            sponsors={data.sponsors}
                            isVolunteer
                        />
                    </div>
                    <AdminStatsBlock
                        stats={
                            [
                                {
                                    current: data.team.volunteers.length,
                                    title: 'Volunteered hours',
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
                        <AdminShareEfforts/>
                    </AdminStatsBlock>
                </AdminLayout>
            </AuthenticatedView>
        );
    }
}
