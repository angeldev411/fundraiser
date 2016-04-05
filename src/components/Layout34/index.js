import React, { Component } from 'react';

import Aside from '../Aside';

export default class Layout34 extends Component {
    render() {
        return (
            <div>
                <div className={`col-xs-12 col-lg-8 col-lg-push-4 layout-3-4 ${this.props.page}`}>
                    <section className="right-content">
                        {this.props.children}
                    </section>
                </div>
                <Aside
                    team={this.props.team}
                    project={this.props.project}
                    volunteerprofile={this.props.volunteerprofile}
                />
                <div className="clearfix"></div>
            </div>
        );
    }
}

Layout34.propTypes = {
    page: React.PropTypes.string,
    project: React.PropTypes.object,
    team: React.PropTypes.object,
    volunteerprofile: React.PropTypes.bool,
};
