import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Button extends Component {
    render() {
        const BUTTON = (
            <button
                type="button"
                className={`btn has-spinner ${this.props.customClass}`}
                onClick={this.props.onClick}
                {...this.props}
            >
                <span className={"spinner"}><i className={"fa fa-circle-o-notch fa-spin"}></i></span>
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
