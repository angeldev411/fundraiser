import React, { Component } from 'react';

import Button from '../Button/';

export default class Header extends Component {
    render() {
        const year = new Date().getFullYear();
        // TODO address microformat

        return (
            <header>
                <div className="container">
                    <a href="#">
                        <img src="/assets/images/raiserve_logo.png"
                            id="logo"
                            title=""
                            alt=""
                        />
                    </a>

                    <button id="toggle-menu"
                        className="visible-xs visible-sm pull-right"
                    >
                        <i className="fa fa-bars"></i>
                    </button>

                    <div id="slide-menu">
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
                                    <a href="#"
                                        title=""
                                    >
                                        {'What is Raiserve?'}
                                    </a>
                                </li>
                                <li>
                                    <a href="#"
                                        title=""
                                    >
                                        {'How Raiserve works'}
                                    </a>
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
                                            <a href="#"
                                                title=""
                                            >
                                                {'Our story'}
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#"
                                                title=""
                                            >
                                                {'The founders'}
                                            </a>
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
                                            <a href="#"
                                                title=""
                                            >
                                                {'Terms of Service'}
                                            </a>
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
                                    <Button>{'Sign In'}</Button>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    <nav className={"hidden-xs hidden-sm"}>
                        <ul className={"nav navbar-nav"}>
                            <li>
                                <a href="#"
                                    title=""
                                >
                                    {'What is Raiserve?'}
                                </a>
                            </li>
                            <li>
                                <a href="#"
                                    title=""
                                >
                                    {'How Raiserve works'}
                                </a>
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

                    <span className={'login-container pull-right hidden-xs hidden-sm'}>
                        <Button>{'Sign In'}</Button>
                    </span>

                </div>
            </header>
        );
    }
}
