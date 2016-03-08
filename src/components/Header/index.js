import React, { Component } from 'react';
import { connect } from 'react-redux';
import Menu from '../Menu/';
import * as Urls from '../../urls.js';
import { Link } from 'react-router';

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: this.props.user,
        };

        window.addEventListener('resize', () => {
            this.setState({
                isDesktop: window.innerWidth >= MOBILE_ACTIVATION_WIDTH,
            });
        });
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        if (nextProps.user) {
            this.setState({
                user: nextProps.user,
            });
        }
    }

    render() {
        // TODO address microformat

        let dashboardUrl = Urls.BASE_URL;

        if (this.state.user) {
            console.log('state user');
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

        return (
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
        );
    }
}

export default connect((reduxState) => ({
    user: reduxState.main.auth.user,
}))(Header);
