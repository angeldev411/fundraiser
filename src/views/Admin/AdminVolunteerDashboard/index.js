/* Import "logic" dependencies first */
import React, { Component } from 'react';

/* Then React components */
import Page from '../../../components/Page';
import AdminLayout from '../../../components/AdminLayout';
import AdminContentHeader from '../../../components/AdminContentHeader';
import AdminStatsBlock from '../../../components/AdminStatsBlock';
import RecordHoursForm from '../../../components/RecordHoursForm';
import AdminShareEfforts from '../../../components/AdminShareEfforts';
import AdminVolunteerChart from '../../../components/AdminVolunteerChart';
import Modal from '../../../components/Modal';
import SocialShareLinks from '../../../components/SocialShareLinks';
import * as Actions from '../../../redux/volunteer/actions';
import { connect } from 'react-redux';
import moment from 'moment';
import * as Urls from '../../../urls.js';

export class AdminVolunteerDashboard extends Component {
    componentWillMount() {
        document.title = 'Dashboard | raiserve';

        this.state = {
            stats: {
                currentHours: 0,
                totalSponsors: 0,
                raised: 0,
            },
        };
        this.updateData();
    }

    updateData(){
      Actions.getHourLogs()(this.props.dispatch);
      Actions.getStats()(this.props.dispatch);
    }

    toggleShareModal(){
      this.setState({
        showRecordHoursSuccessModal: !this.state.showRecordHoursSuccessModal
      });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.hourLogsGet) {
          this.setState({
            hours: nextProps.hourLogsGet,
          });
          this.getMonthHoursList(nextProps.hourLogsGet);
        }

        if (nextProps.stats)
          this.setState({
            stats: nextProps.stats,
            statsError: null,
          });

        if (nextProps.user)
          this.setState({
            user: nextProps.user,
          });

        if (nextProps.sponsors)
          this.setState({
            sponsors: nextProps.sponsors,
          });
    }

    getMonthHoursList(hours) {
        const hourList = [];

        if (!hours || !hours.length) {
            return '';
        }

        for (let i = 0; i < hours.length; i++) {
            const dbDate = hours[i].date.split('-');
            const date = new Date(dbDate[0], dbDate[1] - 1, dbDate[2]);

            if (date.getMonth() === moment().month()) {
                hourList.push({
                    date,
                    new: Number(hours[i].hours),
                    place: hours[i].place,
                });
            }
        }
        this.setState({
            monthHours: hourList,
        });
    }

    render() {
        if (!this.props.user) {
            return (null);
        }

        const pageNav = [
            {
              type: 'button',
              title: 'Record my hours',
              content: <RecordHoursForm team={this.props.user.team} />,
              onModalToggle: this.updateData.bind(this),
              onHourLogSuccess: this.toggleShareModal.bind(this)
            },
            {
                type: 'link',
                title: 'My Public Page',
                href: `${Urls.getVolunteerProfileUrl(this.props.user.project.slug, this.props.user.team.slug, this.props.user.slug)}`,
            },
            {
                type: 'link',
                title: 'Edit My Profile',
                href: `${Urls.ADMIN_USER_PROFILE_URL}`,
            },
        ];

        if( this.props.user.roles.includes('TEAM_LEADER') )
          pageNav.push({
            type:       'link',
            title:      'My Team Dashboard',
            href:       Urls.ADMIN_TEAM_DASHBOARD_URL,
            className:  'navPadding'
          });

        return (
            <Page>
                { this.state.showRecordHoursSuccessModal === true ?
                  <Modal
                    content={
                      <div id={'success-pledge'}>
                        <p>{`Great work, ${this.props.user.firstName}!`}</p>
                        <p>{`Share your progress using the links below.`}</p>
                        <SocialShareLinks
                          volunteer={this.props.user}
                          project={this.props.user.project}
                          team={this.props.user.team}
                        />
                      </div>
                    }
                    onClick={this.toggleShareModal.bind(this)}
                  />
                  : null
                }
                <AdminLayout pageType='VOLUNTEER' pageNav={pageNav}>
                    <AdminContentHeader
                        title={'My Dashboard'}
                        description={'Don’t forget to record all of your hours so you get credit for all of the hours you worked.'}
                        volunteerDashboard
                        goal={this.props.user.goal}
                    />
                  { this.state.monthHours ?
                    <AdminVolunteerChart
                        data={this.state.monthHours}
                        goal={this.props.user.goal}
                        currentMonth={moment().month()}
                        currentYear={moment().year()}
                            />
                          : null }
                    <AdminStatsBlock
                        stats={
                            [
                                {
                                    current: this.state.stats.totalHours,
                                    title: 'Hours',
                                    goal: this.props.user.goal,
                                },
                                {
                                    current: this.state.stats.totalSponsors,
                                    title: 'Sponsors',
                                },
                                {
                                    current: this.state.stats.raised,
                                    title: 'Raised',
                                    prefix: '$',
                                },
                            ]
                        }
                    >
                    <AdminShareEfforts
                      project={this.props.user.project}
                      team={this.props.user.team}
                      volunteer={this.props.user}
                    />
                    </AdminStatsBlock>
                </AdminLayout>
            </Page>
        );
    }
}

export default connect((reduxState) => ({
    user: reduxState.main.auth.user,
    sponsors: reduxState.main.sponsor.sponsors,
    hourLogsGet: reduxState.main.volunteer.hourLogsGet,
    stats: reduxState.main.volunteer.stats,
    statsError: reduxState.main.volunteer.statsError,
}))(AdminVolunteerDashboard);
