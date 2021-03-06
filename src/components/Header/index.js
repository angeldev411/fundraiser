import React, { Component } from 'react';
import { connect } from 'react-redux';
import Menu from '../Menu/';
import * as Urls from '../../urls.js';
import * as constants from '../../common/constants';
import { Link } from 'react-router';
import AdminInviteTeamMembersForm from '../AdminInviteTeamMembersForm/';
import ModalButton from '../ModalButton/';

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: this.props.user,
            volunteer: this.props.volunteer,
            team: this.props.team,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user) {
            this.setState({
                user: nextProps.user,
            });
        }
        if (nextProps.volunteer) {
            this.setState({
                volunteer: nextProps.volunteer,
            });
        }
        if (nextProps.team) {
            this.setState({
                team: nextProps.team,
            });
        }
    }

    render() {
//       const SHARE_URL = `${constants.DOMAIN}${this.props.pathname}`;
//       const TWITTER_MESSAGE = `Sponsor ${this.state.volunteer.firstName} for each hour volunteered. \
// Money goes to ${this.props.project.name}.`;
//       const SLOGAN = this.state.team.slogan || 'Twice the difference';
//       const EMAIL_SUBJECT = `I’m volunteering at ${this.props.project.name}, sponsor me and Make Twice the Difference`;
//       const EMAIL_MESSAGE = `Please help me raise money for ${this.props.project.name}. \
// Sponsor each hour of volunteering I do and together we will make twice the difference.%0D%0A
// %0D%0A
// %0D%0A
// http://${SHARE_URL}` ;


        let dashboardUrl = Urls.BASE_URL;

        if (this.state.user) {
            if (this.state.user.roles.indexOf('SUPER_ADMIN') >= 0) {
                dashboardUrl = Urls.ADMIN_PROJECTS_URL;
            } else if (this.state.user.roles.indexOf('PROJECT_LEADER') >= 0) {
                dashboardUrl = Urls.ADMIN_TEAMS_URL;
            } else if (this.state.user.roles.indexOf('TEAM_LEADER') >= 0) {
                dashboardUrl = Urls.ADMIN_TEAM_DASHBOARD_URL;
            } else if (this.state.user.roles.indexOf('VOLUNTEER') >= 0) {
                dashboardUrl = Urls.ADMIN_VOLUNTEER_DASHBOARD_URL;
            }
        }

        let greenHeader = null;

        if (this.props.user && this.props.greenHeader && this.props.greenHeader === 'volunteer') {
            greenHeader = (
                <div id={'green-header'}>
                    <div className="container">
                        <div className={'col-xs-12'}>
                            <div className={'col-xs-2 green-header-left'}>
                                <Link to={dashboardUrl}>
                                    {'My Dashboard'} <i className="fa fa-angle-double-right"/>
                                </Link>
                            </div>
                            <div className={'col-xs-8 green-header-center'}>
                                <span className={'call-to-action-text'}>
                                    {'This is your personalized fundraising page.'} <br/><b>{'Get started by sharing it on Facebook, Twitter and emailing your colleagues, friends and family'}</b>
                                </span>
                            </div>
                            <div className={'col-xs-2 green-header-right'}>
                                <a href={`mailto:?body=${window.location}`}
                                    className="share"
                                >
                                    <i className="fa fa-envelope"/>
                                </a>
                                <a href={`https://twitter.com/share?url=${window.location}`}
                                    className="share"
                                >
                                    <i className="fa fa-twitter"/>
                                </a>
                                <a href={`https://www.facebook.com/sharer.php?u=${window.location}`}
                                    className="share"
                                >
                                    <i className="fa fa-facebook"/>
                                </a>
                                <ModalButton content={
                                    <AdminInviteTeamMembersForm
                                        project={this.props.project}
                                        team={this.props.team}
                                        title={'Invite new sponsors'}
                                        sponsors
                                    />}
                                    customClass={'btn-green-bar-link'}
                                >
                                    {'INVITE SPONSORS'}
                                </ModalButton>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (this.props.user && this.props.greenHeader && this.props.greenHeader === 'team') {
            greenHeader = (
                <div id={'green-header'}>
                    <div className="container">
                        <div className={'col-xs-2 green-header-left'}>
                            <Link to={dashboardUrl}>
                                {'My Dashboard'} <i className="fa fa-angle-double-right"/>
                            </Link>
                        </div>
                        <div className={'col-xs-8 green-header-center'}>
                            <span className={'call-to-action-text'}>
                                {'Here is your personalized fundraising page.'} <b>{'Get started by inviting team members to your team.'}</b>
                            </span>
                        </div>
                        <div className={'col-xs-2 green-header-right'}>
                            <a href={`mailto:?body=${window.location}`}
                                className="share"
                            >
                                <i className="fa fa-envelope"/>
                            </a>
                            <a href={`https://twitter.com/share?url=${window.location}`}
                                className="share"
                            >
                                <i className="fa fa-twitter"/>
                            </a>
                            <a href={`https://www.facebook.com/sharer.php?u=${window.location}`}
                                className="share"
                            >
                                <i className="fa fa-facebook"/>
                            </a>
                            <ModalButton
                                content={
                                    <AdminInviteTeamMembersForm
                                        project={this.props.project}
                                        team={this.props.team}
                                        title={"Invite New"}
                                        titleLine2={"Team Members"}
                                    />
                                }
                                customClass={'btn-green-bar-link'}
                            >
                                {'INVITE'}
                            </ModalButton>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div>
                {greenHeader}
                <header className="clearfix">
                    <div className="container">
                        <Link to={dashboardUrl}>
                            <img src="/assets/images/raiserve_logo.png"
                                id="logo"
                                title=""
                                alt=""
                            />
                        </Link>
                        <Menu/>
                    </div>
                </header>
            </div>
        );
    }
}

Header.propTypes = {
    greenHeader: React.PropTypes.string,
};

export default connect((reduxState) => ({
    user: reduxState.main.auth.user,
}))(Header);
