import React, { Component } from 'react';

import AdminMenu from '../AdminMenu';

export default class AdminLayout extends Component {
    render() {
        return (
            <div className={"admin-layout"}>
                <div className={'container'}>
                    <AdminMenu/>
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
    page: React.PropTypes.string,
};
