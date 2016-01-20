import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Button extends Component {
    constructor(props) {
        super(props);
        this.propTypes = {
            onClick: React.PropTypes.func
        }
    }

    render() {
        const BUTTON = (
            <button
                type="button"
                className="btn btn-default"
                onClick={this.props.onClick}
            >
                {this.props.children}
            </button>
        );
        if(this.props.to) {
            return (
                <Link to={this.props.to}>
                    {BUTTON}
                </Link>
            )
        }
        return BUTTON;
    }
}
