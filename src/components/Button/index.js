import React, { Component } from 'react';

export default class Button extends Component {
    constructor(props) {
        super(props);
        this.propTypes = {
            onClick: React.PropTypes.func
        }
    }

    render() {
        return (
            <button
                type="button"
                className="btn btn-default"
                onClick={this.props.onClick}
            >
                {this.props.children}
            </button>
        );
    }
}
