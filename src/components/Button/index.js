import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Button extends Component {
    render() {
        const { customClass, ...buttonProps} = this.props;

        const BUTTON = (
            <button
                type="button"
                className={`btn ${this.props.customClass} ${this.props.noSpinner ? '' : 'has-spinner'}`}
                onClick={this.props.onClick}
                {...buttonProps}
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
            );
        }
        return BUTTON;
    }
}

Button.propTypes = {
    onClick: React.PropTypes.func,
    customClass: React.PropTypes.string,
    noSpinner: React.PropTypes.bool,
};
