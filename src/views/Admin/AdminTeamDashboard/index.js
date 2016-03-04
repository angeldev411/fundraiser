/* Import "logic" dependencies first */
import React, { Component } from 'react';
import * as SponsorActions from '../../../redux/sponsor/actions';
import * as VolunteerActions from '../../../redux/volunteer/actions';
import { connect } from 'react-redux';
/* Then React components */
import AuthenticatedView from '../AuthenticatedView';
import CircleStat from '../../../components/CircleStat';
import UserList from '../../../components/UserList';
import AdminLayout from '../../../components/AdminLayout';
import AdminContentHeader from '../../../components/AdminContentHeader';
import AdminInviteTeamMembersForm from '../../../components/AdminInviteTeamMembersForm';
import AdminShareEfforts from '../../../components/AdminShareEfforts';
import * as Urls from '../../../urls.js';

class AdminTeamDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        document.title = 'Dashboard | Raiserve';

        if (this.props.user) {
            const projectSlug = this.props.user.project.slug;
            const teamSlug = this.props.user.team.slug;

            VolunteerActions.getVolunteers(projectSlug, teamSlug)(this.props.dispatch);
            VolunteerActions.getTopVolunteers(projectSlug, teamSlug)(this.props.dispatch);
            SponsorActions.indexSponsors(projectSlug, teamSlug)(this.props.dispatch);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.error) {
            this.setState({ error: nextProps.error });
        }
        if (nextProps.sponsors) {
            this.setState(
                {
                    sponsors: nextProps.sponsors,
                    error: null,
                }
            );
        }
        if (nextProps.volunteers) {
            this.setState(
                {
                    volunteers: nextProps.volunteers,
                    error: null,
                }
            );
        }
        if (nextProps.topVolunteers) {
            this.setState(
                {
                    topVolunteers: nextProps.topVolunteers,
                    error: null,
                }
            );
        }
        if (nextProps.user) {
            const projectSlug = nextProps.user.project.slug;
            const teamSlug = nextProps.user.team.slug;

            if (!this.state.sponsors) {
                SponsorActions.indexSponsors(projectSlug, teamSlug)(this.props.dispatch);
            }
            if (!this.state.volunteers) {
                VolunteerActions.getVolunteers(projectSlug, teamSlug)(this.props.dispatch);
            }

            if (!this.state.topVolunteers) {
                VolunteerActions.getTopVolunteers(projectSlug, teamSlug)(this.props.dispatch);
            }

            this.setState(
                {
                    user: nextProps.user,
                    error: null,
                }
            );
        }
    }

    render() {
        if (!this.props.user || !this.state.sponsors || !this.state.volunteers || !this.state.topVolunteers) {
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
                        title={'My Team Dashboard'}
                        description={'Keep an eye on everyone on your team and watch their individual progress grow.'}
                    />
                    <section className={"stats col-xs-12"}>
                        <CircleStat
                            data={
                                {
                                    current: this.state.volunteers.length,
                                    title: 'Volunteers',
                                }
                            }
                        />
                        <CircleStat
                            data={
                                {
                                    current: this.state.sponsors.length,
                                    title: 'Sponsors',
                                }
                            }
                        />
                        <CircleStat
                            data={
                                {
                                    current: this.props.user.team.raised,
                                    title: '$ Raised',
                                }
                            }
                        />
                    </section>
                    <section className={"col-xs-12"}>
                        <section className={"col-xs-12 col-sm-10"}>
                            <div className="content-header">
                                <h2 className="uppercase">{'Top earners'}</h2>
                                <hr/>
                            </div>
                            <UserList
                                volunteers={this.state.topVolunteers}
                                projectSlug={this.props.user.project.slug}
                                teamSlug={this.props.user.team.slug}
                                color="dark"
                                noSponsor
                            />
                        </section>
                        <section className={"col-xs-12 col-sm-2"}>
                            <AdminShareEfforts/>
                        </section>
                    </section>
                </AdminLayout>
            </AuthenticatedView>
        );
    }
}

export default connect((reduxState) => ({
    user: reduxState.main.auth.user,
    error: reduxState.main.sponsor.error,
    topVolunteers: reduxState.main.volunteer.topVolunteers,
    volunteers: reduxState.main.volunteer.volunteers,
    sponsors: reduxState.main.sponsor.sponsors,
}))(AdminTeamDashboard);
