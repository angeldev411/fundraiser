import React, { Component } from 'react';

export default class ChildrenLine extends Component {
    render() {
        return (
            <li className="children-line clearfix">
                {this.props.children}
            </li>
        );
    }
}
