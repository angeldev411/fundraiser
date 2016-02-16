import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Button extends Component {
    render() {
        const BUTTON = (
            <button
                type="button"
                className={`btn ${this.props.customClass}`}
                onClick={this.props.onClick}
                {...this.props}
            >
                {this.props.children}
            </button>
        );

        if (this.props.to) {
            return (
                <Link to={this.props.to}>
                    {BUTTON}
                </Link>
            )
        }
        return BUTTON;
    }
}

Button.propTypes = {
    onClick: React.PropTypes.func,
    customClass: React.PropTypes.string,
};
