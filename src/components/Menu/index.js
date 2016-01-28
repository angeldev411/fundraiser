import React, { Component } from 'react';
import * as Urls from '../../urls.js';
import { Link } from 'react-router';
import classNames from 'classnames';

import ModalButton from '../ModalButton/';
import SigninForm from '../SigninForm/';

export default class Menu extends Component {
    constructor(props) {
        super(props);

        const MOBILE_ACTIVATION_WIDTH = 992;

        this.state = {
            visible: false,
            isDesktop: window.innerWidth >= MOBILE_ACTIVATION_WIDTH,
            scrollable: true
        };

        window.addEventListener('resize', () => {
            this.setState({
                isDesktop: window.innerWidth >= MOBILE_ACTIVATION_WIDTH
            });
        })
    }

    toggle = () => {
        this.setState({ visible: !this.state.visible });
    };

    toggleOverflow = () => {
        this.setState({ scrollable: !this.state.scrollable });
    };

    render() {
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
                            <li className={'social'}>
                                <a href="#">
                                    <i className="fa fa-facebook"></i>
                                </a>
                            </li>
                            <li className={'social'}>
                                <a href="#">
                                    <i className="fa fa-twitter"></i>
                                </a>
                            </li>
                            <li className="clearfix"></li>
                            <li>
                                <Link to={Urls.RAISERVEBASICS}>
                                    {'Raiserve Basics'}
                                </Link>
                            </li>
                            <li>
                                <span>
                                    {'Get a hold of us'}
                                </span>
                                <ul className={'sub-element'}>
                                    <li>
                                        <a href="#"
                                            title=""
                                        >
                                            <p>
                                                {'230 7th Ave'}<br/>
                                                {'4th Floor'}<br/>
                                                {'New York, NY 10011'}
                                            </p>
                                        </a>
                                    </li>
                                    <li>
                                        <hr/>
                                    </li>
                                    <li>
                                        <a href="#"
                                            title=""
                                        >
                                            {'Talk About Us'}
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"
                                            title=""
                                        >
                                            {'Give Us Money'}
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"
                                            title=""
                                        >
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
                                        <Link to={Urls.FOUNDERS}>
                                            {'The founders'}
                                        </Link>
                                    </li>
                                    <li>
                                        <a href="#"
                                            title=""
                                        >
                                            {'The team'}
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"
                                            title=""
                                        >
                                            {'Our goal'}
                                        </a>
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
                                        <a href="#"
                                            title=""
                                        >
                                            {'Privacy Policy'}
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li className={'login-container'}>
                                <ModalButton type="btn-default"
                                    content={<SigninForm/>}
                                    onModalToggle={this.toggleOverflow}
                                >
                                    {'Sign In'}
                                </ModalButton>
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
                            <Link to={Urls.RAISERVEBASICS}>
                                {'Raiserve Basics'}
                            </Link>
                        </li>
                        <li className={'social'}>
                            <a href="#">
                                <i className="fa fa-facebook"></i>
                            </a>
                        </li>
                        <li className={'social'}>
                            <a href="#">
                                <i className="fa fa-twitter"></i>
                            </a>
                        </li>
                    </ul>
                </nav>

                <span className={'login-container pull-right'}>
                    <ModalButton type="btn-default"
                        content={<SigninForm/>}
                    >
                        {'Sign In'}
                    </ModalButton>
                </span>
            </div>
        );

        if (this.state.isDesktop) {
            return menu;
        }

        return mobileMenu;
    }
}
