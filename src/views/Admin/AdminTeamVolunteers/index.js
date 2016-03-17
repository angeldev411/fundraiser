/* Import "logic" dependencies first */
import React, { Component } from 'react';
import * as Actions from '../../../redux/volunteer/actions';
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


class AdminTeamVolunteers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            volunteers: [],
        };
    }

    componentWillMount() {
        document.title = 'Team volunteers | Raiserve';

        if (this.props.user) {
            this.doAction(this.props.user);
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
    }

    doAction = ((user) => {
        const projectSlug = user.project.slug;
        const teamSlug = user.team.slug;

        Actions.getVolunteers(projectSlug, teamSlug)(this.props.dispatch);
    });

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
                        title={"Invite New Team Members"}
                        project={this.props.user.project}
                        team={this.props.user.team}
                    />,
            },
            {
                title: 'Approve Hours',
                type: 'button',
                content: <AdminApproveHours
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
                        />
                    </div>
                    <AdminStatsBlock
                        stats={
                            [
                                {
                                    current: this.props.user.team.totalVolunteers,
                                    title: 'Volunteers',
                                },
                                {
                                    current: this.props.user.team.totalSponsors,
                                    title: 'Sponsors',
                                },
                                {
                                    current: this.props.user.team.totalRaised,
                                    title: '$ Raised',
                                },
                            ]
                        }
                    >
                        <AdminDownloadCsv/>
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
}))(AdminTeamVolunteers);
