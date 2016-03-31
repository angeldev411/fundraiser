import React, { Component } from 'react';
import Button from '../../components/Button';
import Form from '../../components/Form';
import Dropzone from 'react-dropzone';
import * as Actions from '../../redux/team/actions';
import { connect } from 'react-redux';
import AvatarCropper from 'react-avatar-cropper';

export default class EditCoverForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            file: {
                preview: this.props.value ? `${this.props.value}` : '/assets/images/team/default-cover.png',
            },
            cover: this.props.value ? this.props.value : '',
            team: this.props.team,
            coverImageData: '',
            loading: false,
            cropperOpen: false,
        };
    }

    updateCover = () => {
        this.setState({
            loading: true,
        });
        const team = Object.assign({}, this.state.team);

        if (this.state.coverImageData !== '') {
            team.coverImageData = this.state.coverImageData;
        }

        Actions.updateTeam(
            team.id,
            team
        )(this.props.dispatch);

        team.cover = team.coverImageData;

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
            const coverImageData = upload.target.result;

            this.setState({
                coverImageData,
                cropperOpen: true,
            });
        };
        reader.readAsDataURL(file);
    };

    handleOnCrop = (dataURI) => {
        this.setState({
            cropperOpen: false,
            coverImageData: dataURI,
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
        return (
            <Form title={'Edit Cover'}
                cols={"col-xs-12 col-md-8 col-md-offset-2"}
                id={"edit-cover-form"}
                onSubmit={(e) => { this.updateCover() }}
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
                        <p className={"dropzone-text"}>{'Upload cover photo'}</p>
                    </Dropzone>
                    <AvatarCropper
                        onRequestHide={this.handleRequestHide}
                        onCrop={this.handleOnCrop}
                        cropperOpen={this.state.cropperOpen}
                        image={this.state.file.preview}
                        width={1200}
                        height={500}
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

EditCoverForm.propTypes = {
    value: React.PropTypes.string,
    updateTeam: React.PropTypes.func,
};

export default connect((reduxState) => ({
    team: reduxState.main.team.team,
    error: reduxState.main.team.error,
}))(EditCoverForm);
