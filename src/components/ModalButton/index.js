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

        if(nextProps.hourLogSuccess !== this.props.hourLogSuccess)
          this.props.onHourLogSuccess && this.props.onHourLogSuccess();
      }
    }

    handleClick = () => {
      if(!this.props.disabled){
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
    customClass: React.PropTypes.string,
    content: React.PropTypes.element,
    disabled: React.PropTypes.bool,
    onClick: React.PropTypes.func,
    onModalToggle: React.PropTypes.func,
    onHourLogSuccess: React.PropTypes.func
};

const mapStateToProps = (reduxState) => ({
    user: reduxState.main.auth.user,
    team: reduxState.main.team.team,
    project: reduxState.main.project.project,
    hourLogSuccess: reduxState.main.volunteer.hourLogSuccess,
})
export default connect(mapStateToProps, null, null, {
  withRef: true,
})(ModalButton);
