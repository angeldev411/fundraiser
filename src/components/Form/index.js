import React, { Component } from 'react';
import Button from '../../components/Button';

export default class Form extends Component {
    render() {
        return (
            <div id={this.props.id}
                className={`form-container ${this.props.cols}`}
            >
                <h2>{this.props.title}</h2>
                <p>{this.props.description}</p>
                <form>
                    {this.props.children}
                </form>
            </div>
        );
    }
}

Form.propTypes = {
    id: React.PropTypes.string,
    cols: React.PropTypes.string,
    title: React.PropTypes.string,
    description: React.PropTypes.string,
};