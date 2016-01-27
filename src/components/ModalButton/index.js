import React, { Component } from 'react';
import Button from '../Button/';
import Modal from '../Modal/';

export default class ModalButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            clicked: false,
        };
    }

    handleClick = () => {
        this.setState({ clicked: !this.state.clicked });
        this.props.onModalToggle();
    };

    render() {
        if (this.state.clicked) {
            return (
                <div>
                    <Button type={this.props.type}>{this.props.children}</Button>
                    <Modal content={this.props.content}
                        onClick={this.handleClick}
                    />
                </div>
            );
        }
        return (
            <Button type={this.props.type}
                onClick={this.handleClick}
            >
                {this.props.children}
            </Button>
        );
    }
}

ModalButton.propTypes = {
    onClick: React.PropTypes.func,
    type: React.PropTypes.string,
    content: React.PropTypes.element,
    onModalToggle: React.PropTypes.func,
};
