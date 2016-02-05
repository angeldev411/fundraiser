import React, { Component } from 'react';
import AdminMenu from '../AdminMenu';
import * as Urls from '../../urls.js';

export default class AdminLayout extends Component {
    getNav = (type = 'user') => {
        if (type === 'superadmin') {
            return [
                {
                    title: 'Projects',
                    href: Urls.getAdminProjectsUrl,
                },
                {
                    title: 'All Sponsors',
                    href: Urls.getAdminSponsorsUrl,
                },
                {
                    title: 'All Volunteers',
                    href: Urls.getAdminVolunteersUrl,
                },
            ];
        } else {
            // TODO
        }
        return null;
    };

    render() {
        return (
            <div className={"admin-layout"}>
                <div className={'container'}>
                    <AdminMenu
                        adminNav={this.getNav('superadmin')}
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
