/* Import "logic" dependencies first */
import React, { Component } from 'react';
import * as Actions from '../../../redux/sponsor/actions';
import { connect } from 'react-redux';
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

class AdminVolunteerSponsors extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sponsors: [],
        };
    }

    componentWillMount() {
        document.title = 'My Sponsors | Raiserve';

        if (this.props.user) {
            const projectSlug = this.props.user.project.slug;
            const teamSlug = this.props.user.team.slug;
            const volunteerSlug = this.props.user.slug;

            Actions.indexSponsors(projectSlug, teamSlug, volunteerSlug)(this.props.dispatch);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.error) {
            this.setState({ error: nextProps.error });
        } else if (nextProps.sponsors) {
            this.setState(
                {
                    sponsors: nextProps.sponsors,
                    error: null,
                }
            );
        } else if (nextProps.user) {
            const projectSlug = nextProps.user.project.slug;
            const teamSlug = nextProps.user.team.slug;
            const volunteerSlug = nextProps.user.slug;

            Actions.indexSponsors(projectSlug, teamSlug, volunteerSlug)(this.props.dispatch);

            this.setState(
                {
                    user: nextProps.user,
                    error: null,
                }
            );
        }
    }

    render() {
        if (!this.props.user) {
            return (null);
        }
        const pageNav = [
            {
                type: 'button',
                title: 'Record my hours',
                content: <RecordHoursForm team={this.props.user.team}/>,
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
                            sponsors={this.state.sponsors}
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

export default connect((reduxState) => ({
    user: reduxState.main.auth.user,
    error: reduxState.main.sponsor.error,
    sponsors: reduxState.main.sponsor.sponsors,
}))(AdminVolunteerSponsors);
