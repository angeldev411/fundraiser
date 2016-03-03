/* Import "logic" dependencies first */
import React, { Component } from 'react';
import * as SponsorActions from '../../../redux/sponsor/actions';
import * as VolunteerActions from '../../../redux/volunteer/actions';
import { connect } from 'react-redux';
/* Then React components */
import AuthenticatedView from '../AuthenticatedView';
import AdminStatsBlock from '../../../components/AdminStatsBlock';
import AdminLayout from '../../../components/AdminLayout';
import AdminContentHeader from '../../../components/AdminContentHeader';
import AdminInviteTeamMembersForm from '../../../components/AdminInviteTeamMembersForm';
import AdminDownloadCsv from '../../../components/AdminDownloadCsv';
import AdminSponsorsTable from '../../../components/AdminSponsorsTable';
import * as Urls from '../../../urls.js';

class AdminTeamSponsors extends Component {
    constructor(props) {
        super(props);
        this.state = {
            volunteers: [],
            sponsors: [],
        };
    }

    componentWillMount() {
        document.title = 'Team Sponsors | Raiserve';

        if (this.props.user) {
            const projectSlug = this.props.user.project.slug;
            const teamSlug = this.props.user.team.slug;

            VolunteerActions.getVolunteers(projectSlug, teamSlug)(this.props.dispatch);
            SponsorActions.indexSponsors(projectSlug, teamSlug)(this.props.dispatch);
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
        } else if (nextProps.volunteers) {
            this.setState(
                {
                    volunteers: nextProps.volunteers,
                    error: null,
                }
            );
        } else if (nextProps.user) {
            const projectSlug = nextProps.user.project.slug;
            const teamSlug = nextProps.user.team.slug;

            VolunteerActions.getVolunteers(projectSlug, teamSlug)(this.props.dispatch);
            SponsorActions.indexSponsors(projectSlug, teamSlug)(this.props.dispatch);

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
                type: 'link',
                title: 'Email Your Team',
                href: '#',
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
            <AuthenticatedView accessLevel={'TEAM_LEADER'}>
                <AdminLayout pageNav={pageNav}>
                    <AdminContentHeader
                        title={'Team sponsors'}
                        description={'Keep an eye on everyone on your team and watch their individual progress grow.'}
                    />
                    <div className={'table-limit-height'}>
                        <AdminSponsorsTable sponsors={this.state.sponsors} />
                    </div>
                    <AdminStatsBlock
                        stats={
                            [
                                {
                                    current: this.state.volunteers.length,
                                    title: 'Volunteers',
                                },
                                {
                                    current: this.state.sponsors.length,
                                    title: 'Sponsors',
                                },
                                {
                                    current: this.props.user.team.raised,
                                    title: '$ Raised',
                                },
                            ]
                        }
                    >
                        <AdminDownloadCsv/>
                    </AdminStatsBlock>
                </AdminLayout>
            </AuthenticatedView>
        );
    }
}

export default connect((reduxState) => ({
    user: reduxState.main.auth.user,
    error: reduxState.main.sponsor.error,
    volunteers: reduxState.main.volunteer.volunteers,
    sponsors: reduxState.main.sponsor.sponsors,
}))(AdminTeamSponsors);
