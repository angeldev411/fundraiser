import React, { Component } from 'react';

export default class ChildrenLine extends Component {
    render() {
        return (
            <li className="children-line">
                {this.props.children}
            </li>
        );
    }
}
