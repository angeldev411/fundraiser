import React, { Component } from 'react';
import AdminMenu from '../AdminMenu';
import * as Urls from '../../urls.js';
import * as Data from '../../common/test-data.js'; // TODO remove this

export default class AdminLayout extends Component {
    getNav = (role = 'user') => {
        if (role === 'super-admin') {
            return [
                {
                    title: 'Projects',
                    href: Urls.ADMIN_PROJECTS_URL,
                },
                {
                    title: 'All Sponsors',
                    href: Urls.ADMIN_SPONSORS_URL,
                },
                {
                    title: 'All Volunteers',
                    href: Urls.ADMIN_VOLUNTEERS_URL,
                },
            ];
        } else if (role === 'project-leader') {
            return [
                {
                    title: 'Teams',
                    href: Urls.ADMIN_TEAMS_URL,
                },
                {
                    title: 'All Sponsors',
                    href: Urls.ADMIN_SPONSORS_URL,
                },
                {
                    title: 'All Volunteers',
                    href: Urls.ADMIN_VOLUNTEERS_URL,
                },
            ];
        } else if (role === 'team-leader') {
            return [
                {
                    title: 'My Team Dashboard',
                    href: Urls.ADMIN_TEAM_DASHBOARD_URL,
                },
                {
                    title: 'My Team',
                    href: Urls.ADMIN_TEAM_VOLUNTEERS_URL,
                },
                {
                    title: 'Team Sponsors',
                    href: Urls.ADMIN_TEAM_SPONSORS_URL,
                },
                {
                    title: 'Approve Hours',
                    href: Urls.ADMIN_VOLUNTEERS_URL,
                },
            ];
        }
        return [
            {
                title: 'My Dashboard',
                href: Urls.ADMIN_VOLUNTEER_DASHBOARD_URL,
            },
            {
                title: 'My Sponsors',
                href: Urls.ADMIN_VOLUNTEER_SPONSORS_URL,
            },
        ];
    };

    render() {
        return (
            <div className={"admin-layout"}>
                <div className={'container'}>
                    <AdminMenu
                        adminNav={this.getNav(Data.user.role)}
                        pageNav={this.props.pageNav}
                    />
                    <div className="col-xs-12 col-lg-9 admin-content">
                        <section>
                            {this.props.children}
                        </section>
                    </div>
                    <div className="clearfix"></div>
                </div>
            </div>
        );
    }
}

AdminLayout.propTypes = {
    pageNav: React.PropTypes.array,
};
