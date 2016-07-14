/* Import "logic" dependencies first */
import React, { Component } from 'react';
import * as Actions from '../../../redux/sponsor/actions';
import * as TeamActions from '../../../redux/team/actions';
import { connect } from 'react-redux';
/* Then React components */
import Page from '../../../components/Page';
import AdminStatsBlock from '../../../components/AdminStatsBlock';
import AdminLayout from '../../../components/AdminLayout';
import AdminContentHeader from '../../../components/AdminContentHeader';
import AdminInviteTeamMembersForm from '../../../components/AdminInviteTeamMembersForm';
import AdminTeamEmailForm from '../../../components/AdminTeamEmailForm';
import AdminDownloadCsv from '../../../components/AdminDownloadCsv';
import AdminSponsorsTable from '../../../components/AdminSponsorsTable';
import * as Urls from '../../../urls.js';
import AdminApproveHours from '../../../components/AdminApproveHours';
import lodash from 'lodash';

class AdminTeamSponsors extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sponsors: [],
            stats: {
                totalVolunteers: 0,
                totalSponsors: 0,
                totalRaised: 0,
            },
            sortBy: null,
            ASC: true,
        };
    }

    componentWillMount() {
        document.title = 'Team Sponsors | raiserve';

        if (this.props.user) {
            const projectSlug = this.props.user.project.slug;
            const teamSlug = this.props.user.team.slug;

            Actions.indexSponsors(projectSlug, teamSlug)(this.props.dispatch);
            TeamActions.getStats()(this.props.dispatch);
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

            Actions.indexSponsors(projectSlug, teamSlug)(this.props.dispatch);

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
                title: 'Email Your Team',
                content:
                    <AdminTeamEmailForm
                        project={this.props.user.project}
                        team={this.props.user.team}
                    />,
            },
            {
                type: 'button',
                title: 'Invite members',
                content:
                    <AdminInviteTeamMembersForm
                        title={"Invite New"}
                        titleLine2={"Team Members"}
                        project={this.props.user.project}
                        team={this.props.user.team}
                    />,
            },
            {
                type: 'link',
                title: 'My Public Team Page',
                href: `${Urls.getTeamProfileUrl(this.props.user.project.slug, this.props.user.team.slug)}`,
            },
            {
                type: 'link',
                title: 'Edit Team Profile',
                href: `${Urls.ADMIN_TEAM_PROFILE_URL}`,
            },
        ];

        if( this.props.user.roles.includes('VOLUNTEER') )
          pageNav.push({
            type:       'link',
            title:      'My Volunteer Dash',
            href:       `${Urls.ADMIN_VOLUNTEER_DASHBOARD_URL}`,
            className:  'navPadding'
          });

        return (
            <Page>
                <AdminLayout pageType='TEAM_LEADER' pageNav={pageNav}>
                    <AdminContentHeader
                        title={'Team sponsors'}
                        description={'Keep an eye on everyone on your team and watch their individual progress grow.'}
                    />
                    <div className={'table-limit-height'}>
                        <AdminSponsorsTable
                            sponsors={this.state.sponsors}
                            onSort={this.onSort}/>
                    </div>
                    <AdminStatsBlock
                        stats={
                            [
                                {
                                    current: this.state.stats.totalVolunteers,
                                    title: 'Volunteers',
                                },
                                {
                                    current: this.state.stats.totalSponsors,
                                    title: 'Sponsors',
                                },
                                {
                                    current: this.state.stats.totalRaised,
                                    title: 'Raised',
                                    prefix: '$'
                                },
                            ]
                        }
                    >
                        <AdminDownloadCsv
                            to={'/api/v1/csv/team/sponsors'}
                        />
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
    stats: reduxState.main.team.stats,
    statsError: reduxState.main.team.statsError,
}))(AdminTeamSponsors);
