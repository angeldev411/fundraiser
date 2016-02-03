import React, { Component } from 'react';

export default class AdminMenu extends Component {
    render() {
        return (
            <nav className={'admin-navigation col-xs-12 col-lg-3'}>
                <ul className="admin-nav">
                    <li><a href="#">Projects</a></li>
                    <li><a href="#">All Sponsors</a></li>
                    <li><a href="#">All Volunteers</a></li>
                </ul>

                <ul className="page-nav">
                    <li><a href="#">New Project</a></li>
                </ul>
            </nav>
        )
    }
}
