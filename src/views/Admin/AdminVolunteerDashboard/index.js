/* Import "logic" dependencies first */
import React, { Component } from 'react';

/* Then React components */
import AuthenticatedView from '../AuthenticatedView';
import AdminLayout from '../../../components/AdminLayout';
import AdminContentHeader from '../../../components/AdminContentHeader';
import AdminStatsBlock from '../../../components/AdminStatsBlock';
import RecordHoursForm from '../../../components/RecordHoursForm';
import AdminShareEfforts from '../../../components/AdminShareEfforts';
import AdminVolunteerChart from '../../../components/AdminVolunteerChart';
import * as Actions from '../../../redux/volunteer/actions';
import * as ActionsSponsor from '../../../redux/sponsor/actions';
import { connect } from 'react-redux';
import moment from 'moment';
import * as Urls from '../../../urls.js';

export default class AdminVolunteerDashboard extends Component {
    componentWillMount() {
        document.title = 'Dashboard | Raiserve';

        this.state = {};

        if (this.props.user) {
            const projectSlug = this.props.user.project.slug;
            const teamSlug = this.props.user.team.slug;
            const volunteerSlug = this.props.user.slug;

            ActionsSponsor.indexSponsors(projectSlug, teamSlug, volunteerSlug)(this.props.dispatch);
        }

        Actions.getHourLogs()(this.props.dispatch);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.hourLogsGet) {
            this.setState(
                {
                    hours: nextProps.hourLogsGet,
                }
            );
            this.getMonthHoursList(nextProps.hourLogsGet);
        }
        if (nextProps.user) {
            const projectSlug = nextProps.user.project.slug;
            const teamSlug = nextProps.user.team.slug;
            const volunteerSlug = nextProps.user.slug;

            if (!nextProps.sponsors) {
                ActionsSponsor.indexSponsors(projectSlug, teamSlug, volunteerSlug)(this.props.dispatch);
            }

            this.setState(
                {
                    user: nextProps.user,
                }
            );
        }
        if (nextProps.sponsors) {
            this.setState(
                {
                    sponsors: nextProps.sponsors,
                }
            );
        }
    }

    getMonthHoursList(hours) {
        const hourList = [];

        if (!hours || !hours.length) {
            return '';
        }

        for (let i = 0; i < hours.length; i++) {
            const date = new Date(hours[i].date);

            if (date.getMonth() === moment().month()) {
                hourList.push({
                    date: new Date(hours[i].date),
                    'new': parseInt(hours[i].hours, 10),
                });
            }
        }
        this.setState({
            monthHours: hourList,
        });
    }

    getVolunteerChart() {
        return (<AdminVolunteerChart
            data={this.state.monthHours}
            goal={this.props.user.goal}
            currentMonth={moment().month()}
            currentYear={moment().year()}
                />);
    }

    render() {
        if (!this.props.user || !this.state.sponsors) {
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
        const volunteerChart = this.state.monthHours ? this.getVolunteerChart() : null;

        return (
            <AuthenticatedView accessLevel={'VOLUNTEER'}>
                <AdminLayout pageNav={pageNav}>
                    <AdminContentHeader
                        title={'My Dashboard'}
                        description={'Don’t forget to record all of your hours so you get credit for all of the hours you worked.'}
                        volunteerDashboard
                        goal={this.props.user.goal}
                    />
                    {volunteerChart}
                    <AdminStatsBlock
                        stats={
                            [
                                {
                                    current: this.props.user.currentHours || 0,
                                    title: 'Volunteered hours',
                                    goal: this.props.user.goal,
                                },
                                {
                                    current: this.state.sponsors.length,
                                    title: 'Sponsors',
                                },
                                {
                                    current: this.props.user.raised || 0,
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
    sponsors: reduxState.main.sponsor.sponsors,
    hourLogsGet: reduxState.main.volunteer.hourLogsGet,
}))(AdminVolunteerDashboard);
