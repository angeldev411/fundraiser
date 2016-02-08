import React, { Component } from 'react';
import AdminMenu from '../AdminMenu';
import * as Urls from '../../urls.js';
import * as User from '../../common/test-user.js'; // TODO remove this

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
        } else if (role === 'team-leader') {
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
        }
        return null;
    };

    render() {
        return (
            <div className={"admin-layout"}>
                <div className={'container'}>
                    <AdminMenu
                        adminNav={this.getNav(User.role)}
                        pageNav={this.props.pageNav}
                    />
                    <div className="col-xs-12 col-lg-9 admin-content">
                        <section className="">
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
