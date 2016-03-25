/* Import "logic" dependencies first */
import React, { Component } from 'react';
import * as Actions from '../../../redux/sponsor/actions';
import * as VolunteerActions from '../../../redux/volunteer/actions';
import { connect } from 'react-redux';
/* Then React components */
import Page from '../../../components/Page';
import AdminLayout from '../../../components/AdminLayout';
import AdminContentHeader from '../../../components/AdminContentHeader';
import AdminStatsBlock from '../../../components/AdminStatsBlock';
import AdminSponsorsTable from '../../../components/AdminSponsorsTable';
import AdminShareEfforts from '../../../components/AdminShareEfforts';
import RecordHoursForm from '../../../components/RecordHoursForm';
import * as Urls from '../../../urls.js';

class AdminVolunteerSponsors extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sponsors: [],
            stats: {
                currentHours: 0,
                totalSponsors: 0,
                raised: 0,
            },
        };
    }

    componentWillMount() {
        document.title = 'My Sponsors | Raiserve';

        if (this.props.user) {
            const projectSlug = this.props.user.project.slug;
            const teamSlug = this.props.user.team.slug;
            const volunteerSlug = this.props.user.slug;

            Actions.indexSponsors(projectSlug, teamSlug, volunteerSlug)(this.props.dispatch);
            VolunteerActions.getStats()(this.props.dispatch);
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
        if (nextProps.stats) {
            this.setState(
                {
                    stats: nextProps.stats,
                    statsError: null,
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
                href: `${Urls.getVolunteerProfileUrl(this.props.user.project.slug, this.props.user.team.slug, this.props.user.slug)}`,
            },
            {
                type: 'link',
                title: 'Edit Profile',
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
                            sponsors={this.state.sponsors}
                            isVolunteer
                        />
                    </div>
                    <AdminStatsBlock
                        stats={
                            [
                                {
                                    current: this.state.stats.currentHours,
                                    title: 'Volunteered hours',
                                    goal: this.props.user.goal,
                                },
                                {
                                    current: this.state.stats.totalSponsors,
                                    title: 'Total Sponsors',
                                },
                                {
                                    current: this.state.stats.raised,
                                    title: 'Total Money Raised',
                                },
                            ]
                        }
                    >
                        <AdminShareEfforts/>
                    </AdminStatsBlock>
                </AdminLayout>
            </Page>
        );
    }
}

export default connect((reduxState) => ({
    user: reduxState.main.auth.user,
    error: reduxState.main.sponsor.error,
    sponsors: reduxState.main.sponsor.sponsors,
    stats: reduxState.main.volunteer.stats,
    statsError: reduxState.main.volunteer.statsError,
}))(AdminVolunteerSponsors);
