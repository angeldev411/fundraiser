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
import Modal from '../../../components/Modal';
import SocialShareLinks from '../../../components/SocialShareLinks';
import * as Urls from '../../../urls.js';
import lodash from 'lodash';

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
            sortBy: null,
            ASC: true,
        };
    }

    componentWillMount() {
        document.title = 'My Sponsors | raiserve';

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

    toggleShareModal(){
      this.setState({
        showRecordHoursSuccessModal: !this.state.showRecordHoursSuccessModal
      });
    }

    onSort = (column) => {
        let sponsors = lodash.sortBy(this.state.sponsors, (sponsor) => {
            return sponsor[column].toString().toLowerCase();
        });

        if (!this.state.ASC) {
            sponsors = lodash.reverse(sponsors);
        }

        this.setState({
            sortBy: column,
            ASC: !this.state.ASC,
            sponsors,
        });
    };

    render() {
        if (!this.props.user) {
            return (null);
        }
        const pageNav = [
            {
                type: 'button',
                title: 'Record my hours',
                content: <RecordHoursForm team={this.props.user.team}/>,
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
            href:       `${Urls.ADMIN_TEAM_DASHBOARD_URL}`,
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
                        title={'My sponsors'}
                        description={'Don’t forget to share your good fortune and give thanks on social media.'}
                    />
                    <div className={'table-limit-height'}>
                        <AdminSponsorsTable
                            sponsors={this.state.sponsors}
                            isVolunteer
                            onSort={this.onSort}
                        />
                    </div>
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
                    <section className="share-efforts">
                      <AdminShareEfforts
                        project={this.props.user.project}
                        team={this.props.user.team}
                        volunteer={this.props.user}
                      />
                    </section>
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
