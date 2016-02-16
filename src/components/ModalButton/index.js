import React, { Component } from 'react';
import Button from '../Button/';
import Modal from '../Modal/';
import { connect } from 'react-redux';

class ModalButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            clicked: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user && this.state.clicked) {
            this.handleClick();
        }
    }

    handleClick = () => {
        this.setState({ clicked: !this.state.clicked });
        if (this.props.onModalToggle) {
            this.props.onModalToggle();
        }
    };

    render() {
        if (this.state.clicked) {
            return (
                <div>
                    <Button customClass={this.props.customClass}>{this.props.children}</Button>
                    <Modal content={this.props.content}
                        onClick={this.handleClick}
                    />
                </div>
            );
        }
        return (
            <Button customClass={this.props.customClass}
                onClick={this.handleClick}
            >
                {this.props.children}
            </Button>
        );
    }
}

ModalButton.propTypes = {
    onClick: React.PropTypes.func,
    customClass: React.PropTypes.string,
    content: React.PropTypes.element,
    onModalToggle: React.PropTypes.func,
};

export default connect((reduxState) => ({
    user: reduxState.main.auth.user,
}))(ModalButton);
