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
            console.log('Next Props', nextProps.hourLogsGet);
            this.setState({ hours: nextProps.hourLogsGet });
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
                date: hours[i].date,
                'new': parseInt(hours[i].hours, 10),
            });
        }

        console.log('Graph', data.graph);
        console.log('Hour List', hourList);

        return (<AdminVolunteerChart
            data={hourList}
            goal={data.volunteer.goal}
            currentMonth={moment().month() + 1}
            currentYear={moment().year()}
                />);
    }

    render() {
        console.log('Admin Volunteer Dashboard', this);
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
        const volunteerChart = this.getVolunteerChart();

        return (
            <AuthenticatedView accessLevel={'VOLUNTEER'}>
                <AdminLayout pageNav={pageNav}>
                    <AdminContentHeader
                        title={'My Dashboard'}
                        description={'Don’t forget to record all of your hours so you get credit for all of the hours you worked.'}
                        goal={data.volunteer.goal}
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
    hourLogsGet: reduxState.main.volunteer.hourLogsGet,
}))(AdminVolunteerDashboard);
