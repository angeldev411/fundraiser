import React, { Component } from 'react';
import { connect } from 'react-redux';
import Menu from '../Menu/';
import * as Urls from '../../urls.js';
import { Link } from 'react-router';
import * as constants from '../../common/constants';

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
        console.log(nextProps);
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
        // TODO address microformat

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

        if (this.props.greenHeader && this.props.greenHeader === 'volunteer') {
            greenHeader = (
                <div id={'green-header'}>
                    <div className="container">
                        <div className={'col-xs-2 green-header-left'}>
                            <Link to={dashboardUrl}>
                                {'My Dashboard'}
                            </Link>
                        </div>
                        <div className={'col-xs-8 green-header-center'}>
                            <span className={'call-to-action-text'}>
                                {'Congrats here is your personnalized fundraising page.'} <b>{'Get started by sharing it on Facebook, Twitter and emailing your colleagues, friends and family'}</b>
                            </span>
                        </div>
                        <div className={'col-xs-2 green-header-right'}>
                            <a href={`mailto:?body=${window.location}`}
                                className="share"
                            >
                                <i className="fa fa-envelope"/>
                            </a>
                            <a href={`https://twitter.com/share?url=${window.location}`}
                                target="_blank"
                                className="share"
                            >
                                <i className="fa fa-twitter"/>
                            </a>
                            <a href={`https://www.facebook.com/sharer.php?u=${window.location}`}
                                target="_blank"
                                className="share"
                            >
                                <i className="fa fa-facebook"/>
                            </a>
                            <Link to={dashboardUrl}>
                                {'INVITE SPONSORS'}
                            </Link>
                        </div>
                    </div>
                </div>
            );
        } else if (this.props.greenHeader && this.props.greenHeader === 'team') {
            greenHeader = (
                <div id={'green-header'}>
                    <div className="container">
                        <div className={'col-xs-2 green-header-left'}>
                            <Link to={dashboardUrl}>
                                {'My Dashboard'}
                            </Link>
                        </div>
                        <div className={'col-xs-8 green-header-center'}>
                            <span className={'call-to-action-text'}>
                                {'Congrats here is your personnalized fundraising page.'} <b>{'Get started by inviting team members to your team.'}</b>
                            </span>
                        </div>
                        <div className={'col-xs-2 green-header-right'}>
                            <a href={`mailto:?body=${window.location}`}
                                className="share"
                            >
                                <i className="fa fa-envelope"/>
                            </a>
                            <a href={`https://twitter.com/share?url=${window.location}`}
                                target="_blank"
                                className="share"
                            >
                                <i className="fa fa-twitter"/>
                            </a>
                            <a href={`https://www.facebook.com/sharer.php?u=${window.location}`}
                                target="_blank"
                                className="share"
                            >
                                <i className="fa fa-facebook"/>
                            </a>
                            <Link to={dashboardUrl}>
                                {'INVITE'}
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div>
                {greenHeader}
                <header>
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
