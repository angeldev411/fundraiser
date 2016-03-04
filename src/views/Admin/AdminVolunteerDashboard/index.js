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
import { connect } from 'react-redux';
import moment from 'moment';

import * as Urls from '../../../urls.js';
// TODO dynamic data
import * as data from '../../../common/test-data';

export default class AdminVolunteerDashboard extends Component {
    componentWillMount() {
        document.title = 'Dashboard | Raiserve';

        this.state = {

        };
        Actions.getHourLogs()(this.props.dispatch);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.hourLogsGet) {
            this.setState(
                {
                    hours: nextProps.hourLogsGet,
                }
            );
        } else if (nextProps.user) {
            this.setState(
                {
                    user: nextProps.user,
                }
            );
        }
    }

    getVolunteerChart() {
        const hours = this.state.hours;
        const hourList = [];

        if (!hours || !hours.length) {
            return '';
        }

        for (let i = 0; i < hours.length; i++) {
            hourList.push({
                date: new Date(hours[i].date),
                'new': parseInt(hours[i].hours, 10),
            });
        }

        return (<AdminVolunteerChart
            data={hourList}
            goal={this.props.user.goal}
            currentMonth={moment().month()}
            currentYear={moment().year()}
                />);
    }

    render() {
        if (!this.props.user) {
            return (null);
        }

        const pageNav = [
            {
                type: 'button',
                title: 'Record my hours',
                content: <RecordHoursForm/>,
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
        const volunteerChart = this.getVolunteerChart();

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
                                    current: data.team.volunteers.length,
                                    title: 'Volunteered hours',
                                    goal: 12,
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
    hourLogsGet: reduxState.main.volunteer.hourLogsGet,
}))(AdminVolunteerDashboard);
