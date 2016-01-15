import React, { Component } from 'react';

import classNames from 'classnames';

import styles from './button.scss';

export default class Button extends Component {
    render() {
        return (
            <button
                type="button"
                className="btn btn-default"
            >
                {this.props.children}
            </button>
        );
    }
}
