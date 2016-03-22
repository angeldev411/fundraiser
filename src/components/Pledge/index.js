import React, { Component } from 'react';
import classNames from 'classnames';

import PledgeFormStep1 from '../PledgeFormStep1/';

export default class Pledge extends Component {
    render() {
        return (
            <div className={classNames({
                pledge__open: this.props.open,
                pledge__closed: !this.props.open,
            }, 'pledge col-xs-12')}
            >
                <button
                    type="button"
                    className="close"
                    onClick={this.props.togglePledge}
                >
                    <i className="fa fa-times"></i>
                </button>
                <PledgeFormStep1
                    teamSlug={this.props.teamSlug}
                    volunteerSlug={this.props.volunteerSlug}
                    oneTimeOnly={this.props.oneTimeOnly}
                    goal={this.props.goal}
                />
            </div>
        );
    }
}

Pledge.propTypes = {
    open: React.PropTypes.bool,
    togglePledge: React.PropTypes.func,
    teamSlug: React.PropTypes.string,
    volunteerSlug: React.PropTypes.string,
    oneTimeOnly: React.PropTypes.bool,
    goal: React.PropTypes.number,
};
