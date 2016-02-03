import React, { Component } from 'react';
import Button from '../../components/Button';

export default class Form extends Component {
    render() {
        return (
            <div id={this.props.id}
                className="form-container col-xs-12 col-md-8 col-md-offset-2"
            >
                <h2>{this.props.title}</h2>
                <p>{this.props.description}</p>
                    {this.props.children}
            </div>
        );
    }
}

Form.propTypes = {
    id: React.PropTypes.string,
    title: React.PropTypes.string,
    description: React.PropTypes.string,
};
