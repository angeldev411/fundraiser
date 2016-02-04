import React, { Component } from 'react';
import Button from '../../components/Button';
import Form from '../../components/Form';
import * as Constants from '../../common/constants.js';

export default class AdminContentHeader extends Component {
    render() {
        return (
            <div className="content-header">
                <h1 className="uppercase">{this.props.title}</h1>
                {this.props.buttons}
                <hr/>
                <p>
                    {this.props.description}
                </p>
            </div>
        );
    }
}

AdminContentHeader.propTypes = {
    title: React.PropTypes.string,
    buttons: React.PropTypes.element,
    description: React.PropTypes.string,
};
