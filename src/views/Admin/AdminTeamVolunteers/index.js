/* Import "logic" dependencies first */
import React, { Component } from 'react';
import * as Actions from '../../../redux/volunteer/actions';
import * as TeamActions from '../../../redux/team/actions';
import { connect } from 'react-redux';

/* Then React components */
import Page from '../../../components/Page';
import AdminStatsBlock from '../../../components/AdminStatsBlock';
import ModalButton from '../../../components/ModalButton';
import AdminLayout from '../../../components/AdminLayout';
import AdminContentHeader from '../../../components/AdminContentHeader';
import AdminInviteTeamMembersForm from '../../../components/AdminInviteTeamMembersForm';
import AdminTeamEmailForm from '../../../components/AdminTeamEmailForm';
import AdminDownloadCsv from '../../../components/AdminDownloadCsv';
import AdminVolunteersTable from '../../../components/AdminVolunteersTable';
import * as Urls from '../../../urls.js';
import AdminApproveHours from '../../../components/AdminApproveHours';
import lodash from 'lodash';

class AdminTeamVolunteers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            volunteers: [],
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
        document.title = 'Team volunteers | Raiserve';

        if (this.props.user) {
            const teamSlug = this.props.user.team.slug;

            this.doAction(this.props.user);
            TeamActions.getStats()(this.props.dispatch);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.error) {
            this.setState({ error: nextProps.error });
        } else if (nextProps.volunteers) {
            this.setState(
                {
                    volunteers: nextProps.volunteers,
                    error: null,
                }
            );
        } else if (nextProps.user) {
            this.doAction(nextProps.user);

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

    handleUnlinkVolunteers = (volunteers) => {
        if (window.confirm('Do you really want to remove selected volunteer(s)?')) {
            Actions.unlinkVolunteers(volunteers)(this.props.dispatch);
        }
    };

    doAction = ((user) => {
        const projectSlug = user.project.slug;
        const teamSlug = user.team.slug;

        Actions.getVolunteers(projectSlug, teamSlug)(this.props.dispatch);
    });

    onSort = (column) => {
        let volunteers = lodash.sortBy(this.state.volunteers, (volunteer) => {
            return volunteer[column].toString().toLowerCase();
        });

        if (!this.state.ASC) {
            volunteers = lodash.reverse(volunteers);
        }

        this.setState({
            sortBy: column,
            ASC: !this.state.ASC,
            volunteers,
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

        return (
            <Page>
                <AdminLayout pageNav={pageNav}>
                    <AdminContentHeader
                        title={'My Team'}
                        description={'Keep an eye on everyone on your team and watch their individual progress grow.'}
                        buttons={
                            <ModalButton customClass="btn-link pull-right uppercase"
                                content={
                                    <AdminInviteTeamMembersForm
                                        title={"Invite Members"}
                                        project={this.props.user.project}
                                        team={this.props.user.team}
                                    />
                                }
                            >
                                {'Invite new members'}
                            </ModalButton>
                        }
                    />
                    <div className={'table-limit-height'}>
                        <AdminVolunteersTable
                            volunteers={this.state.volunteers}
                            user={this.props.user}
                            actionable
                            onUnlink={this.handleUnlinkVolunteers}
                            onSort={this.onSort}
                        />
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
                                    title: 'Total Sponsors',
                                },
                                {
                                    current: this.state.stats.totalRaised,
                                    title: 'Total Money Raised',
                                },
                            ]
                        }
                    >
                        <AdminDownloadCsv
                            to={'http://raiserve.local:3777/api/v1/csv/team/volunteers'}
                        />
                    </AdminStatsBlock>
                </AdminLayout>
            </Page>
        );
    }
}

export default connect((reduxState) => ({
    user: reduxState.main.auth.user,
    error: reduxState.main.volunteer.error,
    volunteers: reduxState.main.volunteer.volunteers,
    stats: reduxState.main.team.stats,
    statsError: reduxState.main.team.statsError,
}))(AdminTeamVolunteers);
