import React, { Component } from 'react';
import ModalButton from '../ModalButton/';

export default class EditButton extends Component {
    render() {
        return (
            <div className={`btn-edit-container btn-edit-${this.props.direction} btn-edit-${this.props.name}`}>
                <ModalButton
                    content={this.props.content}
                    customClass={'btn-lg btn-edit'}
                >
                    {`Edit ${this.props.children}`}
                </ModalButton>
            </div>
        );
    }
}

EditButton.propTypes = {
    onClick: React.PropTypes.func,
    direction: React.PropTypes.string,
    name: React.PropTypes.string,
    content: React.PropTypes.element,
};
