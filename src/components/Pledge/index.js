import React, { Component } from 'react';
import * as Urls from '../../urls.js';
import * as constants from '../../common/constants';
import { Link } from 'react-router';
import classNames from 'classnames';

import PledgeForm from '../PledgeForm/';

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
                <PledgeForm
                    teamSlug={this.props.teamSlug}
                    volunteerSlug={this.props.volunteerSlug}
                    oneTimeOnly={this.props.oneTimeOnly}
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
};
