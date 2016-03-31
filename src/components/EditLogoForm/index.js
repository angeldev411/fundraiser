import React, { Component } from 'react';
import Button from '../../components/Button';
import Form from '../../components/Form';
import Dropzone from 'react-dropzone';
import AvatarCropper from 'react-avatar-cropper';
import * as Actions from '../../redux/team/actions';
import { connect } from 'react-redux';

export default class EditLogoForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            file: {
                preview: this.props.value,
            },
            logo: this.props.value ? this.props.value : '',
            team: this.props.team,
            logoImageData: '',
            loading: false,
            cropperOpen: false,
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
        this.setState({
            loading: true,
        });
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


    handleOnDrop = (files) => {
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
                cropperOpen: true,
            });
        };
        reader.readAsDataURL(file);
    };

    handleOnCrop = (dataURI) => {
        this.setState({
            cropperOpen: false,
            logoImageData: dataURI,
            file: {
                preview: dataURI,
            },
        });
    };

    handleRequestHide = () => {
        this.setState({
            cropperOpen: false,
        });
    };

    render() {
        console.log(this.props.value);
        return (
            <Form title={'Edit Logo'}
                cols={"col-xs-12 col-md-8 col-md-offset-2"}
                id={"edit-logo-form"}
                onSubmit={(e) => { this.updateLogo() }}
            >
                <div className="dropzone form-group">
                    <Dropzone
                        onDrop={this.handleOnDrop}
                        multiple={false}
                        style={{ }}
                    >
                        <img
                            className={"dropzone-image"}
                            src={this.state.file.preview}
                        />
                        <p className={"dropzone-text"}>{'Upload logo'}</p>
                    </Dropzone>
                    <AvatarCropper
                        onRequestHide={this.handleRequestHide}
                        onCrop={this.handleOnCrop}
                        cropperOpen={this.state.cropperOpen}
                        image={this.state.file.preview}
                        width={200}
                        height={70}
                    />
                </div>
                <Button
                    customClass="btn-green-white"
                    type={'submit'}
                    disabled={this.state.loading}
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
