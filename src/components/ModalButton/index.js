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
        if (this.state.clicked && (
                nextProps.user !== this.props.user
                || nextProps.team !== this.props.team
                || nextProps.project !== this.props.project
                || nextProps.hourLogSuccess !== this.props.hourLogSuccess
            )
        ) {
            this.handleClick();
        }
    }

    handleClick = () => {
        if(this.props.disabled){
            this.setState({clicked: false});
        }else{
            this.setState({ clicked: !this.state.clicked });
            if (this.props.onModalToggle) this.props.onModalToggle();
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
    disabled: React.PropTypes.boolean,
};

export default connect((reduxState) => ({
    user: reduxState.main.auth.user,
    team: reduxState.main.team.team,
    project: reduxState.main.project.project,
    hourLogSuccess: reduxState.main.volunteer.hourLogSuccess,
}))(ModalButton);
