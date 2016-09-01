/* Import "logic" dependencies first */
import React, { Component } from 'react';
import * as VolunteerActions from '../../../redux/volunteer/actions';
import * as TeamActions from '../../../redux/team/actions';

import { connect } from 'react-redux';
/* Then React components */
import Page from '../../../components/Page';
import CircleStat from '../../../components/CircleStat';
import UserList from '../../../components/UserList';
import ModalButton from '../../../components/ModalButton';
import AdminLayout from '../../../components/AdminLayout';
import AdminContentHeader from '../../../components/AdminContentHeader';
import AdminInviteTeamMembersForm from '../../../components/AdminInviteTeamMembersForm';
import AdminTeamEmailForm from '../../../components/AdminTeamEmailForm';
import AdminShareEfforts from '../../../components/AdminShareEfforts';

import * as Urls from '../../../urls.js';

class AdminTeamDashboard extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            topVolunteers: [],
            stats: {
                totalVolunteers: 0,
                totalSponsors: 0,
                totalRaised: 0,
                totalHours: 0,
                totalMaxCap: 0,
                totalHourly: 0,

            },
        };
    }

    componentWillMount() {
        document.title = 'Dashboard | raiserve';

        if (this.props.user) {
            const projectSlug = this.props.user.project.slug;
            const teamSlug = this.props.user.team.slug;

            VolunteerActions.getTopVolunteers(projectSlug, teamSlug)(this.props.dispatch);
            //VolunteerActions.getStats()(this.props.dispatch);
            TeamActions.getStats()(this.props.dispatch);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.error) {
            this.setState({ error: nextProps.error });
        }
        if (nextProps.stats) {
            this.setState(
                {
                    stats: nextProps.stats,
                    statsError: null,
                }
            );
        }
        if (nextProps.topVolunteers) {
            console.log(nextProps.topVolunteers);
            this.setState(
                {
                    topVolunteers: nextProps.topVolunteers,
                    error: null,
                },

            );
        }
        
        if (nextProps.user) {
            const projectSlug = nextProps.user.project.slug;
            const teamSlug = nextProps.user.team.slug;

            if (!this.state.topVolunteers) {
                VolunteerActions.getTopVolunteers(projectSlug, teamSlug)(this.props.dispatch);
            }

            this.setState(
                {
                    user: nextProps.user,
                    error: null,
                }
            )
        }
    }

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
            },{
                type: 'link',
                title: 'Edit My Profile',
                href: Urls.ADMIN_USER_PROFILE_URL
            }
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
                        title={'My Team Dashboard'}
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
                    <section className={"stats col-xs-12"}>
                        <CircleStat
                            data={
                                {
                                    current: this.state.stats.totalVolunteers,
                                    title: 'Volunteers',
                                }
                            }
                        />
                        <CircleStat
                            data={
                                {
                                    current: this.state.stats.totalSponsors,
                                    title: 'Sponsors',
                                }
                            }
                        />
                        <CircleStat
                            data={
                                {
                                    current: this.state.stats.totalRaised,
                                    title: 'Raised',
                                    prefix: '$'
                                }
                            }
                        />
                    </section>
                    
                    <section className={"stats col-xs-2"}></section>                          
                    <section className={"stats col-xs-8"}>
                        <CircleStat
                            data={
                                {
                                    current: this.state.stats.totalHours,
                                    title: 'Total Hours'
                                }
                            }
                        />

                        <CircleStat
                            data={
                                {
                                    current: this.state.stats.totalMaxCap,
                                    title: 'If Goal Reached',
                                    prefix: '$'
                                }
                            }
                        />
                         
                    </section>
                    <section className={"stats col-xs-2"}></section>
                    <section className={"col-xs-12"}>
                        <section className={"col-xs-12 col-sm-9"}>
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
                        <section className={"col-xs-12 col-sm-3"}>
                          <AdminShareEfforts
                            project={this.props.user.project}
                            team={this.props.user.team}
                          />

                        </section>
                    </section>
                    <section className={"stats col-xs-12"}>
                        <CircleStat
                            data={
                                {
                                    current: this.state.stats.totalHours,
                                    title: 'Total Hours'
                                }
                            }
                        />

                        <CircleStat
                            data={
                                {
                                    current: this.state.stats.totalSponsors,
                                    title: 'Sponsors'
                
                                }
                            }
                        />   
                         <CircleStat
                            data={
                                {
                                    current: this.state.stats.totalRaised,
                                    title: 'Raised',
                                    prefix: '$'
                                }
                            }
                        /> 
                    </section>   
                    <section className={"stats col-xs-2"}></section> 
                     <section className={"stats col-xs-8"}>    
                         <CircleStat
                            data={
                                {
                                    current: this.state.stats.totalHourly,
                                    title: '$/HR',
                                    prefix: '$'
                                }
                            }
                        /> 
                        <CircleStat
                            data={
                                {
                                    current: this.state.stats.totalMaxCap,
                                    title: 'Raised If Goal Reached',
                                    prefix: '$'
                                }
                            }
                        />   
                    </section>
                    <section className={"stats col-xs-2"}></section> 
                </AdminLayout>
            </Page>
        );
    }
}

export default connect((reduxState) => ({
    user: reduxState.main.auth.user,
    error: reduxState.main.sponsor.error,
    topVolunteers: reduxState.main.volunteer.topVolunteers,
    stats: reduxState.main.team.stats,
    statsError: reduxState.main.team.statsError,
}))(AdminTeamDashboard);