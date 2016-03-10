import React, { Component } from 'react';
import Button from '../../components/Button';
import Form from '../../components/Form';
import Dropzone from 'react-dropzone';
import * as Actions from '../../redux/team/actions';
import { connect } from 'react-redux';

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
        };
    }

    updateCover = () => {
        const team = Object.assign({}, this.state.team);

        if (this.state.coverImageData !== '') {
            team.coverImageData = this.state.coverImageData;
        }

        Actions.updateTeam(
            team.id,
            team
        )(this.props.dispatch);
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
            const coverImageData = upload.target.result;

            this.setState({
                coverImageData,
            });
        };
        reader.readAsDataURL(file);
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
                        onDrop={this.onDrop}
                        multiple={false}
                        style={{ }}
                    >
                        <img
                            className={"dropzone-image"}
                            src={this.state.file.preview}
                        />
                        <p className={"dropzone-text"}>{'Upload cover photo'}</p>
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

EditCoverForm.propTypes = {
    value: React.PropTypes.string,
};

export default connect((reduxState) => ({
    team: reduxState.main.team.team,
    error: reduxState.main.team.error,
}))(EditCoverForm);
