import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as Urls from '../../urls.js';
import * as constants from '../../common/constants';
import { Link } from 'react-router';
import classNames from 'classnames';
import * as Actions from '../../redux/auth/actions';

import ModalButton from '../ModalButton/';
import Button from '../Button/';
import SigninForm from '../SigninForm/';

const MOBILE_ACTIVATION_WIDTH = 992;

class Menu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            isDesktop: window.innerWidth >= MOBILE_ACTIVATION_WIDTH,
            scrollable: true
        };
    }

    componentDidMount() {
       window.addEventListener('resize', this.SET_IS_DESKTOP);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.SET_IS_DESKTOP);
    }

    SET_IS_DESKTOP = () => {
        this.setState({
            isDesktop: window.innerWidth >= MOBILE_ACTIVATION_WIDTH,
        });
    };

    toggle = () => {
        this.setState({ visible: !this.state.visible });
    };

    toggleOverflow = () => {
        this.setState({ scrollable: !this.state.scrollable });
    };

    logout = () => {
        Actions.logout()(this.props.dispatch);
    };

    handleChange = (evt) => {
        this.setState({
            value: evt.target.value,
        });
    };

    render() {
        let dashboardUrl = null;

        if (this.props.user) {
            if (this.props.user.roles.indexOf('SUPER_ADMIN') >= 0) {
                dashboardUrl = Urls.ADMIN_PROJECTS_URL;
            } else if (this.props.user.roles.indexOf('PROJECT_LEADER') >= 0) {
                dashboardUrl = Urls.ADMIN_TEAMS_URL;
            } else if (this.props.user.roles.indexOf('TEAM_LEADER') >= 0) {
                dashboardUrl = Urls.ADMIN_TEAM_DASHBOARD_URL;
            } else if (this.props.user.roles.indexOf('VOLUNTEER') >= 0) {
                dashboardUrl = Urls.ADMIN_VOLUNTEER_DASHBOARD_URL;
            }
        }

        // TODO address microformat
        const mobileMenu = (
            <div>
                <button id="toggle-menu"
                    className="pull-right"
                    onClick={this.toggle}
                >
                    <i className="fa fa-bars"></i>
                </button>

                <div id="mobile-menu-overlay"
                    className={classNames({
                        'mobile-menu-overlay__hidden': !this.state.visible,
                    })}
                    style={{ width: window.innerWidth, height: window.innerHeight }}
                    onClick={this.toggle}
                >
                </div>

                <div id="mobile-menu"
                    className={classNames({
                        'mobile-menu__open': this.state.visible,
                        'mobile-menu__closed': !this.state.visible,
                        'mobile-menu__scrollable': this.state.scrollable,
                    })}
                >
                    <nav>
                        <ul className={"nav navbar-nav"}>
                            <li className={'login-container'}>
                                {this.props.user ? `Welcome back ${this.props.user.firstName || ''}` : null}
                                {this.props.user ?
                                    <div>
                                        <Button
                                            to={dashboardUrl}
                                            customClass={'btn-default'}
                                        >{'Dashboard'}</Button>
                                        <Button
                                            onClick={this.logout}
                                            customClass={'btn-default'}
                                        >{'Logout'}</Button>
                                    </div> :
                                    <ModalButton
                                        customClass="btn-default"
                                        content={<SigninForm/>}
                                        onModalToggle={this.toggleOverflow}
                                    >
                                        {'Sign In'}
                                    </ModalButton>
                                }
                            </li>
                            <li className='centered-menu-item'>
                                <Link
                                    to={Urls.RAISERVE_BASICS}
                                >
                                    {'RAISERVE BASICS'}
                                </Link>
                            </li>
                            <li className='centered-menu-item'>
                                <Link
                                  to={constants.FACEBOOK_PAGE}
                                >
                                  <i className="fa fa-facebook"></i>
                                </Link>

                                <Link
                                  to={constants.TWITTER_PAGE}
                                >
                                  <i className="fa fa-twitter"></i>
                                </Link>
                            </li>
                            <li className="mobile-menu-margin">
                                <span>
                                    {'Get a hold of us'}
                                </span>
                                <ul className={'sub-element'}>
                                    <li>
                                        <p>
                                            {'242 West 104th St'}<br/>
                                            {'Suite 6ER'}<br/>
                                            {'New York, NY 10025'}<br/>
                                            {'804 537-2473'}
                                        </p>
                                    </li>
                                    <li>
                                        <hr/>
                                    </li>
                                    <li>
                                        <a href={`mailto:${constants.CONTACT_EMAIL}`}>
                                            {'Ask Us'}
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <span className={'bloc-title'}>
                                    {'Who we are'}
                                </span>
                                <ul className={'sub-element'}>
                                    <li>
                                        <Link to={Urls.STORY}>
                                            {'Our Story'}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={Urls.FAQ}>
                                            {'FAQ'}
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <span className={'bloc-title'}>
                                    {'The legal stuff'}
                                </span>
                                <ul className={'sub-element'}>
                                    <li>
                                        <Link to={Urls.LEGALS}>
                                            {'Terms of Service'}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={Urls.PRIVACY}>
                                            {'Privacy Policy'}
                                        </Link>
                                    </li>
                                </ul>
                            </li>

                        </ul>
                    </nav>
                </div>
            </div>
        );

        const menu = (
            <div>
                <nav>
                    <ul className={"nav navbar-nav"}>
                        <li>
                            <Link
                                to={Urls.RAISERVE_BASICS}
                            >
                                {'RAISERVE BASICS'}
                            </Link>
                        </li>
                        <li className={'social'}>
                            <a
                                href={`${constants.FACEBOOK_PAGE}`}
                            >
                                <i className="fa fa-facebook"></i>
                            </a>
                        </li>
                        <li className={'social'}>
                            <a
                                href={`${constants.TWITTER_PAGE}`}
                            >
                                <i className="fa fa-twitter"></i>
                            </a>
                        </li>
                    </ul>
                </nav>

                <span className={'login-container pull-right'}>
                    {this.props.user ? `Welcome back ${this.props.user.firstName || ''}` : null}
                    {this.props.user ?
                        <span>
                            {this.props.user.lastUser ?
                                <a
                                    href={'/api/v1/auth/switch'}
                                    className={'btn btn-default'}
                                >{`Return as ${this.props.user.lastUser.firstName}`}</a>
                                :
                                <Button
                                    onClick={this.logout}
                                    customClass={'btn-default'}
                                >{'Logout'}</Button>
                            }
                        </span> :
                        <ModalButton
                            customClass="btn-default"
                            content={<SigninForm/>}
                        >
                            {'Sign In'}
                        </ModalButton>
                    }
                </span>
            </div>
        );
        if (this.state.isDesktop) {
            return menu;
        } else {
            return mobileMenu;
        }

    }
}

export default connect((reduxState) => ({
    user: reduxState.main.auth.user,
}))(Menu);
