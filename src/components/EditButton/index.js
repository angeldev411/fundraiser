import React, { Component } from 'react';
import Button from '../Button/';

export default class EditButton extends Component {
    render() {
        return (
            <div className={`btn-edit-container btn-edit-${this.props.direction} btn-edit-${this.props.name}`}>
                <Button type={'btn-lg btn-edit'}>
                    {`Edit ${this.props.children}`}
                </Button>
            </div>
        );
    }
}

EditButton.propTypes = {
    onClick: React.PropTypes.func,
    direction: React.PropTypes.string,
    name: React.PropTypes.string,
};
