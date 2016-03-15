import React, { Component } from 'react';
import Button from '../../components/Button';
import Form from '../../components/Form';
import Dropzone from 'react-dropzone';
import * as Actions from '../../redux/team/actions';
import * as constants from '../../common/constants';
import { connect } from 'react-redux';

export default class EditLogoForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            file: {
                preview: this.props.value ? `${this.props.value}` : '/assets/images/team/default-logo.png',
            },
            logo: this.props.value ? this.props.value : '',
            team: this.props.team,
            logoImageData: '',
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.team) {
            this.setState({
                team: nextProps.team,
            });
        }
    }

    updateLogo = () => {
        const team = Object.assign({}, this.state.team);

        if (this.state.logoImageData !== '') {
            team.logoImageData = this.state.logoImageData;
        }

        Actions.updateTeam(
            team.id,
            team
        )(this.props.dispatch);

        team.logo = team.logoImageData;

        this.props.updateTeam(team);
    };

    handleChange = (event, name) => {
        const newState = {};

        newState[name] = event.nativeEvent.target.value;
        this.setState(newState);
    };


    onDrop = (files) => {
        const user = this.state.user;
        const reader = new FileReader();
        const file = files[0];

        this.setState({
            file: files[0],
        });

        reader.onload = (upload) => {
            const logoImageData = upload.target.result;

            this.setState({
                logoImageData,
            });
        };
        reader.readAsDataURL(file);
    };

    render() {
        return (
            <Form title={'Edit Logo'}
                cols={"col-xs-12 col-md-8 col-md-offset-2"}
                id={"edit-logo-form"}
                onSubmit={(e) => { this.updateLogo() }}
            >
                <div className="dropzone form-group">
                    <Dropzone
                        onDrop={this.onDrop}
                        multiple={false}
                        style={{ }}
                    >
                        <img
                            className={"dropzone-image"}
                            src={this.state.file.preview}
                        />
                        <p className={"dropzone-text"}>{'Upload logo'}</p>
                    </Dropzone>
                </div>
                <Button
                    customClass="btn-green-white"
                    type={'submit'}
                >
                    {'save'}
                </Button>
            </Form>
        );
    }
}

EditLogoForm.propTypes = {
    value: React.PropTypes.string,
    updateTeam: React.PropTypes.func,
};

export default connect((reduxState) => ({
    team: reduxState.main.team.team,
    error: reduxState.main.team.error,
}))(EditLogoForm);
