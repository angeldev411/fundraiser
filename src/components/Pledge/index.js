import React, { Component } from 'react';
import * as Urls from '../../urls.js';
import * as constants from '../../common/constants';
import { Link } from 'react-router';
import classNames from 'classnames';

import SigninForm from '../SigninForm/';

export default class Pledge extends Component {
    render() {
        return (
            <div className={`${this.props.status} pledge`}>
                <button type="button"
                    className="close"
                    onClick={this.props.togglePledge}
                >
                    <i className="fa fa-times"></i>
                </button>
                <p>{'Hey horld'}</p>
            </div>
        );
    }
}

Pledge.propTypes = {
    status: React.PropTypes.string,
    togglePledge: React.PropTypes.func,
};
